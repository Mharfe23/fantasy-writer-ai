
declare global {
  interface Window {
    lastGeneratedImage?: {
      prompt: string;
      imageUrl: string;
      timestamp: string;
    };
  }
}

export {};
