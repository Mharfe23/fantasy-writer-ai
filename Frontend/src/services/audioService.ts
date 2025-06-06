import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface AudioGenerationRequest {
  text: string;
  voice: string;
  speed: number;
}

export interface AudioGenerationResponse {
  id?: string;
  prompt?: string;
  voice?: string;
  speed?: number;
  audioUrl?: string;
  audioData: string;  // Base64 encoded audio data
  timestamp: string;
  minioPath?: string;
  userId?: string;
}

export interface CustomVoiceRequest {
  voiceName?: string;  // Optional for testing
  text?: string;
  voice1: string;
  voice2: string;
  weight1: number;
  weight2: number;
}

export interface CustomVoiceResponse {
  id: string;
  name: string;
  voice1: string;
  voice2: string;
  weight1: number;
  weight2: number;
  tensorUrl: string;
  minioPath: string;
  userId: string;
  createdAt: string;
}

export interface CustomVoice {
  id: string;
  voice_name: string;
  voice_id1: string;
  voice_id2: string;
  voice_weight1: number;
  voice_weight2: number;
  voice_url: string;
  user_id: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const userId = payload.userId;

    if (!userId) {
      throw new Error("No user ID found in token");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Id": userId
    };
  } catch (error) {
    console.error("Error parsing token:", error);
    throw new Error("Invalid token format");
  }
};

export const generateAudio = async (
  request: AudioGenerationRequest
): Promise<AudioGenerationResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/audio/generate`,
      request,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Failed to generate audio');
  }
};

export const getAvailableVoices = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audio/voices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error('Failed to fetch available voices');
  }
};

export const createCustomVoice = async (
  request: CustomVoiceRequest
): Promise<CustomVoiceResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/audio/create-custom-voice`,
      request,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating custom voice:', error);
    throw new Error('Failed to create custom voice');
  }
};

export const testCustomVoice = async (
  request: CustomVoiceRequest
): Promise<AudioGenerationResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/audio/test-custom-voice`,
      request,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error testing custom voice:', error);
    throw new Error('Failed to test custom voice');
  }
};

export const getCustomVoices = async (): Promise<CustomVoice[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/audio/custom-voices`,
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching custom voices:', error);
    throw new Error('Failed to fetch custom voices');
  }
}; 