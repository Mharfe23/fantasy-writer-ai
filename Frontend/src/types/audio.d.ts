
export interface GeneratedAudioData {
  prompt: string;
  voice: string;
  speed: number;
  audioUrl: string;
  timestamp: string;
}

declare global {
  interface Window {
    lastGeneratedAudio?: GeneratedAudioData;
  }
}

export {};
