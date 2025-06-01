# Audio Service

This is a Flask server that handles audio generation and custom voice creation using Kokoro TTS.

## Prerequisites

- Python 3.8 or higher
- MinIO server running on localhost:9000
- Kokoro voice tensors in the `voices` directory

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create required directories:
```bash
mkdir -p voices/custom
```

4. Copy Kokoro voice tensors:
- Copy all `.pt` files from the Kokoro model to the `voices` directory
- Make sure the filenames match the voice names in `VOICE_NAMES`

## Configuration

The server uses the following default configuration:
- MinIO endpoint: localhost:9000
- MinIO credentials: username/password
- Flask server port: 5000

To change these settings, modify the corresponding values in `audio_service.py`.

## Running the Server

```bash
python audio_service.py
```

The server will start on http://localhost:5000

## API Endpoints

### Generate Audio
```
POST /api/audio/generate
```
Generates audio from text using a specified voice.

### Get Available Voices
```
GET /api/audio/voices
```
Returns a list of available voice names.

### Create Custom Voice
```
POST /api/audio/create-custom-voice
```
Creates a custom voice by blending two existing voices.

### Test Custom Voice
```
POST /api/audio/test-custom-voice
```
Tests a custom voice blend before saving it.

## Error Handling

The server returns appropriate HTTP status codes and error messages:
- 400: Bad Request (missing parameters)
- 500: Internal Server Error

## File Structure

```
audio-service/
├── audio_service.py
├── requirements.txt
├── README.md
└── voices/
    ├── af_heart.pt
    ├── af_alloy.pt
    └── custom/
``` 