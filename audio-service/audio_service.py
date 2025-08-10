from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
from kokoro import KPipeline
import soundfile as sf
import io
import os
from minio import Minio
from datetime import datetime, timedelta
import uuid
import json
import torch
import numpy as np
from werkzeug.utils import secure_filename
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import base64
import logging
from urllib.parse import urlparse
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure caching
cache_config = {
    'CACHE_TYPE': 'RedisCache',
    'CACHE_REDIS_HOST': os.getenv('REDIS_HOST', 'localhost'),
    'CACHE_REDIS_PORT': int(os.getenv('REDIS_PORT', 6379)),
    'CACHE_REDIS_DB': int(os.getenv('REDIS_DB', 0)),
    'CACHE_REDIS_PASSWORD': os.getenv('REDIS_PASSWORD', None),
    'CACHE_DEFAULT_TIMEOUT': int(os.getenv('CACHE_TIMEOUT', 3600)),  # 1 hour default
    'CACHE_KEY_PREFIX': 'audio_service:'
}

app.config.from_mapping(cache_config)
cache = Cache(app)

# Define directories
VOICES_DIR = os.path.join(os.path.dirname(__file__), 'voices')
os.makedirs(VOICES_DIR, exist_ok=True)

# MinIO configuration
minio_client = Minio(
    os.getenv('MINIO_ENDPOINT', 'localhost:9000'),
    access_key=os.getenv('MINIO_ACCESS_KEY', 'username'),
    secret_key=os.getenv('MINIO_SECRET_KEY', 'password'),
    secure=False
)

# Configure CORS for MinIO
cors_config = {
    "CORSRules": [
        {
            "AllowedOrigins": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedHeaders": ["*"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3600
        }
    ]
}

# PostgreSQL configuration
DB_CONFIG = {
    "dbname": os.getenv('POSTGRES_DB', 'fantasy_writer_db'),
    "user": os.getenv('POSTGRES_USER', 'postgres'),
    "password": os.getenv('POSTGRES_PASSWORD', 'postgres'),
    "host": os.getenv('POSTGRES_HOST', 'localhost'),
    "port": os.getenv('POSTGRES_PORT', '5432')
}

# Ensure bucket exists and set CORS
BUCKET_NAME = "fantasy-audio"
try:
    minio_client.make_bucket(BUCKET_NAME)
    minio_client.set_bucket_cors(BUCKET_NAME, cors_config)
except Exception as e:
    print(f"Warning: {str(e)}")

# Initialize Kokoro TTS pipeline
pipeline = KPipeline(lang_code='a')

# Available voices
VOICE_NAMES = [
    "af_heart", "af_alloy", "af_aoede", "af_bella", "af_jessica", "af_kore", "af_nicole",
    "af_nova", "af_river", "af_sarah", "af_sky", "am_adam", "am_echo", "am_eric",
    "am_fenrir", "am_liam", "am_michael", "am_onyx", "am_puck", "am_santa", "bf_alice",
    "bf_emma", "bf_isabella", "bf_lily", "bm_daniel", "bm_fable", "bm_george", "bm_lewis"
]

# Load all voice tensors
VOICE_TENSORS = {}
for name in VOICE_NAMES:
    try:
        VOICE_TENSORS[name] = torch.load(f'voices/{name}.pt', weights_only=True)
    except Exception as e:
        print(f"Warning: Could not load voice tensor for {name}: {str(e)}")

def generate_cache_key(*args):
    """Generate a cache key from arguments"""
    content = '|'.join(str(arg) for arg in args)
    return hashlib.md5(content.encode()).hexdigest()

def get_db_connection():
    """Create a database connection"""
    return psycopg2.connect(**DB_CONFIG)

@cache.memoize(timeout=86400)  # Cache voice tensors for 24 hours
def get_cached_voice_tensor(voice_name):
    """Get and cache voice tensor"""
    if voice_name in VOICE_TENSORS:
        return VOICE_TENSORS[voice_name]
    return None

@cache.memoize(timeout=3600)  # Cache custom voice queries for 1 hour
def get_cached_custom_voice(voice_name, user_id):
    """Get and cache custom voice data from database"""
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT voice_url FROM favorite_voices 
                WHERE voice_name = %s AND user_id = %s
            """, (voice_name, user_id))
            result = cur.fetchone()
            return dict(result) if result else None
    except psycopg2.Error as e:
        logger.error(f"Database error in get_cached_custom_voice: {str(e)}")
        return None
    finally:
        if conn:
            conn.close()

@cache.memoize(timeout=1800)  # Cache custom voice list for 30 minutes
def get_cached_custom_voices_list(user_id):
    """Get and cache list of custom voices for a user"""
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT 
                    id,
                    voice_name,
                    voice_id1,
                    voice_id2,
                    voice_weight1,
                    voice_weight2,
                    voice_url,
                    user_id
                FROM favorite_voices 
                WHERE user_id = %s
                ORDER BY voice_name
            """, (user_id,))
            voices = cur.fetchall()
            return [dict(voice) for voice in voices]
    except psycopg2.Error as e:
        logger.error(f"Database error in get_cached_custom_voices_list: {str(e)}")
        return []
    finally:
        if conn:
            conn.close()

def save_audio_to_minio(audio_data, user_id, prefix="audio"):
    """Helper function to save audio data to MinIO"""
    temp_filename = secure_filename(f"{prefix}_{uuid.uuid4()}.wav")
    sf.write(temp_filename, audio_data, 24000)
    
    try:
        with open(temp_filename, 'rb') as file_data:
            file_stat = os.stat(temp_filename)
            minio_path = f"{prefix}/{user_id}/{temp_filename}"
            minio_client.put_object(
                BUCKET_NAME,
                minio_path,
                file_data,
                file_stat.st_size,
                content_type="audio/wav"
            )
            
        # Generate presigned URL that expires in 7 days
        url = minio_client.presigned_get_object(
            BUCKET_NAME,
            minio_path,
            expires=timedelta(days=7)
        )
        
        return url, minio_path
    finally:
        # Clean up temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

def save_tensor_to_minio(tensor_data, user_id, filename):
    """Helper function to save tensor data to MinIO"""
    temp_filename = secure_filename(filename)
    torch.save(tensor_data, temp_filename)
    
    try:
        with open(temp_filename, 'rb') as file_data:
            file_stat = os.stat(temp_filename)
            minio_path = f"voices/{user_id}/{temp_filename}"
            minio_client.put_object(
                BUCKET_NAME,
                minio_path,
                file_data,
                file_stat.st_size,
                content_type="application/octet-stream"
            )
            
        # Generate presigned URL that expires in 7 days
        url = minio_client.presigned_get_object(
            BUCKET_NAME,
            minio_path,
            expires=timedelta(days=7)
        )
        
        return url, minio_path
    finally:
        # Clean up temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.route('/api/audio/generate', methods=['POST'])
def generate_audio():
    try:
        data = request.json
        text = data.get('text')
        voice = data.get('voice')
        speed = data.get('speed', 1.0)
        user_id = request.headers.get('User-Id')
        
        if not text or not voice:
            return jsonify({"error": "Missing required parameters"}), 400
            
        print(f"Generating audio with voice: {voice}, speed: {speed}")
        
        # Generate cache key for this audio generation request
        audio_cache_key = generate_cache_key(text, voice, speed)
        
        # Check if audio is already cached
        cached_audio = cache.get(audio_cache_key)
        if cached_audio:
            logger.info(f"Returning cached audio for key: {audio_cache_key}")
            return jsonify(cached_audio)
        
        # Check if it's a custom voice using cached function
        voice_data = get_cached_custom_voice(voice, user_id)
        
        if voice_data:
            # It's a custom voice, load from MinIO
            try:
                # Extract bucket and object name from the URL
                voice_url = voice_data['voice_url']
                if not voice_url:
                    return jsonify({
                        "error": "Voice URL is missing",
                        "details": "The voice tensor might have been deleted from storage"
                    }), 404
                    
                # Generate cache key for custom voice tensor
                custom_voice_cache_key = generate_cache_key("custom_voice_tensor", voice_url)
                
                # Check if custom voice tensor is cached
                voice_tensor = cache.get(custom_voice_cache_key)
                if voice_tensor is None:
                    # Load and cache the custom voice tensor
                    try:
                        # Parse the URL to get the path
                        parsed_url = urlparse(voice_url)
                        path_parts = parsed_url.path.strip('/').split('/')
                        
                        # Remove the bucket name from the path
                        if path_parts[0] == BUCKET_NAME:
                            path_parts = path_parts[1:]
                        
                        # Join the remaining parts to get the object name
                        object_name = '/'.join(path_parts)
                        
                        # Download the tensor
                        response = minio_client.get_object(BUCKET_NAME, object_name)
                        # Read the response data into a BytesIO buffer
                        buffer = io.BytesIO(response.read())
                        voice_tensor = torch.load(buffer)
                        
                        # Cache the loaded tensor for 1 hour
                        cache.set(custom_voice_cache_key, voice_tensor, timeout=3600)
                        logger.info(f"Cached custom voice tensor: {custom_voice_cache_key}")
                        
                    except Exception as e:
                        return jsonify({
                            "error": "Failed to load voice tensor",
                            "details": f"The voice tensor could not be loaded: {str(e)}"
                        }), 500
                        
            except Exception as e:
                print(f"Error accessing custom voice: {str(e)}")
                return jsonify({
                    "error": "Failed to access voice storage",
                    "details": "Could not access the voice tensor storage"
                }), 500
        else:
            # It's a default voice, use cached function
            if voice not in VOICE_NAMES:
                return jsonify({"error": f"Voice {voice} not found"}), 400
            voice_tensor = get_cached_voice_tensor(voice)
            if voice_tensor is None:
                return jsonify({"error": f"Could not load voice tensor for {voice}"}), 500
                
        # Generate audio using Kokoro
        try:
            generator = pipeline(text, voice=voice_tensor)
            audio_chunks = []
            
            for i, (gs, ps, audio) in enumerate(generator):
                if audio is not None:
                    audio_chunks.append(audio)
            
            if not audio_chunks:
                return jsonify({"error": "Failed to generate audio"}), 500
            
            # Concatenate all chunks
            audio_data = np.concatenate(audio_chunks)
        except Exception as e:
            print(f"Error in audio generation: {str(e)}")
            return jsonify({"error": f"Audio generation failed: {str(e)}"}), 500
            
        # Save to MinIO and get URL
        try:
            url, minio_path = save_audio_to_minio(audio_data, user_id)
        except Exception as e:
            print(f"Error saving to MinIO: {str(e)}")
            return jsonify({"error": f"Failed to save audio: {str(e)}"}), 500
        
        # Convert audio data to base64 for direct playback
        try:
            # Save audio data to a temporary file
            temp_filename = f"temp_{uuid.uuid4()}.wav"
            sf.write(temp_filename, audio_data, 24000)
            
            # Read the file and convert to base64
            with open(temp_filename, 'rb') as audio_file:
                audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
            
            # Clean up temporary file
            os.remove(temp_filename)
        except Exception as e:
            print(f"Error converting audio to base64: {str(e)}")
            return jsonify({"error": f"Failed to process audio: {str(e)}"}), 500
        
        # Create audio metadata
        audio_metadata = {
            "id": str(uuid.uuid4()),
            "prompt": text,
            "voice": voice,
            "speed": speed,
            "audioUrl": url,
            "audioData": f"data:audio/wav;base64,{audio_base64}",
            "timestamp": datetime.utcnow().isoformat(),
            "minioPath": minio_path,
            "userId": user_id
        }
        
        # Cache the generated audio for 1 hour
        cache.set(audio_cache_key, audio_metadata, timeout=3600)
        logger.info(f"Cached generated audio: {audio_cache_key}")
        
        return jsonify(audio_metadata)
        
    except Exception as e:
        print(f"Unexpected error in generate_audio: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/audio/voices', methods=['GET'])
@cache.cached(timeout=86400)  # Cache voices list for 24 hours
def get_voices():
    response = jsonify(VOICE_NAMES)
    # Add cache headers
    response.headers['Cache-Control'] = 'public, max-age=86400'
    response.headers['ETag'] = generate_cache_key("voices_list", len(VOICE_NAMES))
    return response

@app.route('/api/audio/create-custom-voice', methods=['POST'])
def create_custom_voice():
    try:
        # Validate request data
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        voice_name = data.get('voiceName')
        voice1 = data.get('voice1')
        voice2 = data.get('voice2')
        weight1 = data.get('weight1', 0.5)
        weight2 = data.get('weight2', 0.5)
        user_id = request.headers.get('User-Id')
        
        # Validate required parameters
        if not voice_name:
            return jsonify({"error": "Voice name is required"}), 400
        if not voice1:
            return jsonify({"error": "First voice is required"}), 400
        if not voice2:
            return jsonify({"error": "Second voice is required"}), 400
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        # Validate voice names exist
        if voice1 not in VOICE_NAMES:
            return jsonify({"error": f"Voice {voice1} not found"}), 400
        if voice2 not in VOICE_NAMES:
            return jsonify({"error": f"Voice {voice2} not found"}), 400
            
        # Validate weights
        if not isinstance(weight1, (int, float)) or not isinstance(weight2, (int, float)):
            return jsonify({"error": "Weights must be numbers"}), 400
        if weight1 < 0 or weight1 > 1 or weight2 < 0 or weight2 > 1:
            return jsonify({"error": "Weights must be between 0 and 1"}), 400
            
        # Get voice tensors
        try:
            v1 = VOICE_TENSORS.get(voice1)
            v2 = VOICE_TENSORS.get(voice2)
            
            # Check if tensors exist and are valid
            if v1 is None:
                return jsonify({"error": f"Could not load voice tensor for {voice1}"}), 500
            if v2 is None:
                return jsonify({"error": f"Could not load voice tensor for {voice2}"}), 500
        except Exception as e:
            print(f"Error loading voice tensors: {str(e)}")
            return jsonify({"error": "Failed to load voice tensors"}), 500
            
        # Create custom voice by blending
        try:
            # Ensure weights are tensors on the correct device
            weight1_tensor = torch.tensor(weight1, device=v1.device)
            weight2_tensor = torch.tensor(weight2, device=v1.device)
            
            # Blend voices with proper tensor operations
            custom_voice = (v1 * weight1_tensor + v2 * weight2_tensor) / (weight1_tensor + weight2_tensor)
            
            # Ensure the result is a valid tensor
            if not isinstance(custom_voice, torch.Tensor):
                raise ValueError("Failed to create valid voice tensor")
                
        except Exception as e:
            print(f"Error blending voices: {str(e)}")
            return jsonify({"error": "Failed to blend voices"}), 500
            
        # Save custom voice tensor to MinIO
        try:
            voice_filename = f"{voice_name}_{uuid.uuid4()}.pt"
            tensor_url, minio_path = save_tensor_to_minio(custom_voice, user_id, voice_filename)
        except Exception as e:
            print(f"Error saving tensor to MinIO: {str(e)}")
            return jsonify({"error": "Failed to save custom voice"}), 500
            
        # Save to database
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Check if voice name already exists for this user
                cur.execute("""
                    SELECT id FROM favorite_voices 
                    WHERE voice_name = %s AND user_id = %s
                """, (voice_name, user_id))
                if cur.fetchone():
                    return jsonify({"error": "A voice with this name already exists"}), 400
                    
                # Insert new custom voice
                cur.execute("""
                    INSERT INTO favorite_voices (
                        id, voice_name, voice_id1, voice_id2, voice_weight1, voice_weight2,
                        voice_url, user_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    str(uuid.uuid4()),
                    voice_name,
                    voice1,
                    voice2,
                    int(weight1 * 100),  # Convert to integer percentage
                    int(weight2 * 100),  # Convert to integer percentage
                    tensor_url,  # This is the MinIO URL from save_tensor_to_minio
                    user_id
                ))
                voice_metadata = cur.fetchone()
                conn.commit()
                
                if not voice_metadata:
                    raise Exception("Failed to create voice record")
                
                # Invalidate cached custom voices list for this user
                cache.delete_memoized(get_cached_custom_voices_list, user_id)
                logger.info(f"Invalidated custom voices cache for user: {user_id}")
                    
                return jsonify(voice_metadata)
                
        except psycopg2.Error as e:
            print(f"Database error: {str(e)}")
            if conn:
                conn.rollback()
            return jsonify({"error": "Database error occurred"}), 500
        except Exception as e:
            print(f"Error saving to database: {str(e)}")
            if conn:
                conn.rollback()
            return jsonify({"error": "Failed to save voice metadata"}), 500
        finally:
            if conn:
                conn.close()
                
    except Exception as e:
        print(f"Unexpected error in create_custom_voice: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/audio/test-custom-voice', methods=['POST'])
def test_custom_voice():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        text = data.get('text')
        voice1 = data.get('voice1')
        voice2 = data.get('voice2')
        weight1 = data.get('weight1')
        weight2 = data.get('weight2')
        user_id = request.headers.get('User-Id')
        
        if not all([text, voice1, voice2, weight1, weight2, user_id]):
            return jsonify({"error": "Missing required parameters"}), 400
            
        # Load voice tensors
        voice1_path = os.path.join(VOICES_DIR, f"{voice1}.pt")
        voice2_path = os.path.join(VOICES_DIR, f"{voice2}.pt")
        
        if not os.path.exists(voice1_path) or not os.path.exists(voice2_path):
            return jsonify({"error": "One or both voice tensors not found"}), 404
            
        voice1_tensor = torch.load(voice1_path)
        voice2_tensor = torch.load(voice2_path)
        
        # Validate tensors
        if voice1_tensor is None or voice2_tensor is None:
            return jsonify({"error": "Invalid voice tensors"}), 400
            
        
        # Blend voices
        blended_voice = (weight1 * voice1_tensor + weight2 * voice2_tensor) / (weight1 + weight2)
        
        # Generate audio using the pipeline
        try:
            generator = pipeline(text, voice=blended_voice)
            audio_chunks = []
            
            for i, (gs, ps, audio) in enumerate(generator):
                if audio is not None:
                    audio_chunks.append(audio)
            
            if not audio_chunks:
                return jsonify({"error": "Failed to generate audio"}), 500
            
            # Concatenate all chunks
            audio_data = np.concatenate(audio_chunks)
            
            # Save audio data to a temporary file
            temp_filename = f"temp_{uuid.uuid4()}.wav"
            sf.write(temp_filename, audio_data, 24000)
            
            # Read the file and convert to base64
            with open(temp_filename, 'rb') as audio_file:
                audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
            
            # Clean up temporary file
            os.remove(temp_filename)
            
            return jsonify({
                "audioData": audio_base64,
                "timestamp": datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error generating audio: {str(e)}")
            return jsonify({"error": f"Failed to generate audio: {str(e)}"}), 500
        
    except Exception as e:
        logger.error(f"Error in test-custom-voice: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/audio/custom-voices', methods=['GET'])
def get_custom_voices():
    try:
        user_id = request.headers.get('User-Id')
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Use cached function to get custom voices
        voices = get_cached_custom_voices_list(user_id)
        
        # Debug log
        print("Found custom voices:", voices)
        
        response = jsonify(voices)
        # Add cache headers
        response.headers['Cache-Control'] = 'public, max-age=1800'  # 30 minutes
        response.headers['ETag'] = generate_cache_key("custom_voices", user_id, len(voices))
        
        return response
                
    except Exception as e:
        print(f"Unexpected error in get_custom_voices: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Cache management endpoints for debugging and administration
@app.route('/api/cache/stats', methods=['GET'])
def cache_stats():
    """Get cache statistics and health"""
    try:
        # Check Redis connection
        redis_client = cache.cache._write_client
        info = redis_client.info()
        
        stats = {
            "redis_connected": True,
            "redis_version": info.get('redis_version'),
            "used_memory": info.get('used_memory_human'),
            "connected_clients": info.get('connected_clients'),
            "total_commands_processed": info.get('total_commands_processed'),
            "keyspace_hits": info.get('keyspace_hits'),
            "keyspace_misses": info.get('keyspace_misses'),
            "cache_hit_ratio": round(
                info.get('keyspace_hits', 0) / 
                max(info.get('keyspace_hits', 0) + info.get('keyspace_misses', 0), 1) * 100, 2
            ) if info.get('keyspace_hits') is not None else 0
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({
            "redis_connected": False,
            "error": str(e)
        }), 500

@app.route('/api/cache/clear', methods=['POST'])
def clear_cache():
    """Clear all cache entries"""
    try:
        data = request.json or {}
        cache_type = data.get('type', 'all')
        
        if cache_type == 'all':
            cache.clear()
            message = "All cache cleared"
        elif cache_type == 'audio':
            # Clear audio generation cache (would need specific implementation)
            # For now, clear all as we don't have pattern-specific clearing
            cache.clear()
            message = "Audio cache cleared"
        elif cache_type == 'voices':
            # Clear voice-related cache
            cache.clear()
            message = "Voice cache cleared"
        else:
            return jsonify({"error": "Invalid cache type"}), 400
            
        logger.info(f"Cache cleared: {cache_type}")
        return jsonify({"message": message})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cache/invalidate-user', methods=['POST'])
def invalidate_user_cache():
    """Invalidate cache for a specific user"""
    try:
        data = request.json
        user_id = data.get('user_id') if data else None
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Invalidate user-specific cached data
        cache.delete_memoized(get_cached_custom_voices_list, user_id)
        
        # Note: Audio generation cache would need pattern-based deletion
        # which isn't directly supported by Flask-Caching
        logger.info(f"Invalidated cache for user: {user_id}")
        
        return jsonify({"message": f"Cache invalidated for user {user_id}"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000) 