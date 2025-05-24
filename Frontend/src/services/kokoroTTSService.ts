import { fal } from "@fal-ai/client";

// Configure FAL client - API key should be set by user in the UI
fal.config({
  credentials: "" // Will be set dynamically when user provides their API key
});

export interface KokoroTtsRequest {
  prompt: string;
  voice: string;
  speed: number;
}

export interface KokoroTtsResponse {
  audio: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

export interface GeneratedAudio {
  id: string;
  prompt: string;
  voice: string;
  speed: number;
  audioUrl: string;
  timestamp: Date;
  duration?: string;
}

// Available American English voices with proper typing
export const AMERICAN_ENGLISH_VOICES = [
  { value: "af_heart" as const, label: "Heart (Female)" },
  { value: "af_alloy" as const, label: "Alloy (Female)" },
  { value: "af_aoede" as const, label: "Aoede (Female)" },
  { value: "af_bella" as const, label: "Bella (Female)" },
  { value: "af_jessica" as const, label: "Jessica (Female)" },
  { value: "af_kore" as const, label: "Kore (Female)" },
  { value: "af_nicole" as const, label: "Nicole (Female)" },
  { value: "af_nova" as const, label: "Nova (Female)" },
  { value: "af_river" as const, label: "River (Female)" },
  { value: "af_sarah" as const, label: "Sarah (Female)" },
  { value: "af_sky" as const, label: "Sky (Female)" },
  { value: "am_adam" as const, label: "Adam (Male)" },
  { value: "am_echo" as const, label: "Echo (Male)" },
  { value: "am_eric" as const, label: "Eric (Male)" },
  { value: "am_fenrir" as const, label: "Fenrir (Male)" },
  { value: "am_liam" as const, label: "Liam (Male)" },
  { value: "am_michael" as const, label: "Michael (Male)" },
  { value: "am_onyx" as const, label: "Onyx (Male)" },
  { value: "am_puck" as const, label: "Puck (Male)" },
  { value: "am_santa" as const, label: "Santa (Male)" }
];

// Type for valid voice values
export type VoiceType = typeof AMERICAN_ENGLISH_VOICES[number]['value'];

// Function to set API key from user input
export const setFalApiKey = (apiKey: string) => {
  fal.config({
    credentials: apiKey
  });
  // Store in localStorage for persistence
  localStorage.setItem('fal-api-key', apiKey);
};

// Function to get API key from localStorage
export const getFalApiKey = (): string | null => {
  return localStorage.getItem('fal-api-key');
};

// Initialize API key from localStorage on service load
const storedApiKey = getFalApiKey();
if (storedApiKey) {
  fal.config({
    credentials: storedApiKey
  });
}

export const generateAudioWithKokoro = async (request: KokoroTtsRequest): Promise<string> => {
  try {
    const apiKey = getFalApiKey();
    if (!apiKey) {
      throw new Error("FAL API key not set. Please provide your API key in the settings.");
    }
    
    console.log("Generating audio with Kokoro TTS:", request);
    
    // Create the input object with the correct structure for the FAL API
    const input = {
      prompt: request.prompt,
      voice: request.voice,
      speed: request.speed
    } as any; // Use 'as any' to bypass strict typing while maintaining functionality
    
    const result = await fal.subscribe("fal-ai/kokoro/american-english", {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      }
    });
    
    console.log("Kokoro TTS response:", result);
    
    if (!result.data || !result.data.audio || !result.data.audio.url) {
      throw new Error("Invalid response from Kokoro TTS API");
    }
    
    return result.data.audio.url;
  } catch (error) {
    console.error("Error generating audio with Kokoro TTS:", error);
    throw new Error(`Failed to generate audio: ${error.message}`);
  }
};

export const saveGeneratedAudio = (request: KokoroTtsRequest, audioUrl: string): GeneratedAudio => {
  const audio: GeneratedAudio = {
    id: Date.now().toString(),
    prompt: request.prompt,
    voice: request.voice,
    speed: request.speed,
    audioUrl,
    timestamp: new Date()
  };
  
  // Save to localStorage for persistence
  const existingAudios = getStoredAudios();
  const updatedAudios = [audio, ...existingAudios];
  localStorage.setItem('generated-audios', JSON.stringify(updatedAudios));
  
  return audio;
};

export const getStoredAudios = (): GeneratedAudio[] => {
  try {
    const stored = localStorage.getItem('generated-audios');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
