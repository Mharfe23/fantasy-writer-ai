from flask import Flask, request, jsonify
from flask_cors import CORS
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

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get Hugging Face token from environment variable
HF_TOKEN = os.getenv('HUGGINGFACE_TOKEN')
if not HF_TOKEN:
    print("Warning: HUGGINGFACE_TOKEN environment variable not set")

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
    "dbname": os.getenv('POSTGRES_DB', 'fantasy_db'),
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

# Initialize Kokoro TTS pipeline with Hugging Face token
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

def get_db_connection():
    """Create a database connection"""
    return psycopg2.connect(**DB_CONFIG)

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
        
        # Generate audio using Kokoro
        try:
            # Check if voice exists in available voices
            if voice not in VOICE_NAMES:
                return jsonify({"error": f"Voice {voice} not found"}), 400
                
            generator = pipeline(text, voice=voice)
            audio_data = None
            
            for i, (gs, ps, audio) in enumerate(generator):
                if audio is not None:  # Check if audio is not None instead of using it as a boolean
                    audio_data = audio
                    break  # We only need the first audio segment
                
            if audio_data is None:  # Check if audio_data is None instead of using it as a boolean
                return jsonify({"error": "Failed to generate audio"}), 500
                
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
                import base64
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
            "audioUrl": url,  # MinIO URL for storage
            "audioData": f"data:audio/wav;base64,{audio_base64}",  # Direct audio data for immediate playback
            "timestamp": datetime.utcnow().isoformat(),
            "minioPath": minio_path,
            "userId": user_id
        }
        
        return jsonify(audio_metadata)
        
    except Exception as e:
        print(f"Unexpected error in generate_audio: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/audio/voices', methods=['GET'])
def get_voices():
    return jsonify(VOICE_NAMES)

@app.route('/api/audio/create-custom-voice', methods=['POST'])
def create_custom_voice():
    try:
        data = request.json
        voice_name = data.get('voiceName')
        voice1 = data.get('voice1')
        voice2 = data.get('voice2')
        weight1 = data.get('weight1', 0.5)
        weight2 = data.get('weight2', 0.5)
        user_id = request.headers.get('User-Id')
        
        if not all([voice_name, voice1, voice2, user_id]):
            return jsonify({"error": "Missing required parameters"}), 400
            
        # Get voice tensors
        v1 = VOICE_TENSORS.get(voice1)
        v2 = VOICE_TENSORS.get(voice2)
        
        if not v1 or not v2:
            return jsonify({"error": "Invalid voice selection"}), 400
            
        # Create custom voice by blending
        custom_voice = (v1 * weight1 + v2 * weight2) / (weight1 + weight2)
        
        # Save custom voice tensor to MinIO
        voice_filename = f"{voice_name}_{uuid.uuid4()}.pt"
        tensor_url, minio_path = save_tensor_to_minio(custom_voice, user_id, voice_filename)
        
        # Save to database
        conn = get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    INSERT INTO custom_voices (
                        id, name, voice1, voice2, weight1, weight2,
                        tensor_url, minio_path, user_id, created_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *
                """, (
                    str(uuid.uuid4()),
                    voice_name,
                    voice1,
                    voice2,
                    weight1,
                    weight2,
                    tensor_url,
                    minio_path,
                    user_id,
                    datetime.utcnow()
                ))
                voice_metadata = cur.fetchone()
                conn.commit()
        finally:
            conn.close()
        
        return jsonify(voice_metadata)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/audio/test-custom-voice', methods=['POST'])
def test_custom_voice():
    try:
        data = request.json
        text = data.get('text', "This is a test of the custom voice.")
        voice1 = data.get('voice1')
        voice2 = data.get('voice2')
        weight1 = data.get('weight1', 0.5)
        weight2 = data.get('weight2', 0.5)
        
        if not all([voice1, voice2]):
            return jsonify({"error": "Missing required parameters"}), 400
            
        # Get voice tensors
        v1 = VOICE_TENSORS.get(voice1)
        v2 = VOICE_TENSORS.get(voice2)
        
        if not v1 or not v2:
            return jsonify({"error": "Invalid voice selection"}), 400
            
        # Create temporary custom voice
        custom_voice = (v1 * weight1 + v2 * weight2) / (weight1 + weight2)
        
        # Generate test audio
        generator = pipeline(text, voice=custom_voice)
        audio_data = None
        
        for i, (gs, ps, audio) in enumerate(generator):
            audio_data = audio
            break
            
        if not audio_data:
            return jsonify({"error": "Failed to generate audio"}), 500
            
        # Save to MinIO and get URL
        url, _ = save_audio_to_minio(audio_data, "test", prefix="test")
        
        # Convert audio data to base64 for direct playback
        try:
            # Save audio data to a temporary file
            temp_filename = f"temp_{uuid.uuid4()}.wav"
            sf.write(temp_filename, audio_data, 24000)
            
            # Read the file and convert to base64
            with open(temp_filename, 'rb') as audio_file:
                import base64
                audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
            
            # Clean up temporary file
            os.remove(temp_filename)
        except Exception as e:
            print(f"Error converting audio to base64: {str(e)}")
            return jsonify({"error": f"Failed to process audio: {str(e)}"}), 500
        
        return jsonify({
            "audioUrl": url,
            "audioData": f"data:audio/wav;base64,{audio_base64}",
            "text": text,
            "voice1": voice1,
            "voice2": voice2,
            "weight1": weight1,
            "weight2": weight2
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000) 