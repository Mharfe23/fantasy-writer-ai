
export {};

declare global {
  interface Window {
    lastEnhancedPrompt?: {
      original: string;
      enhanced: string;
    };
    lastGeneratedImage?: {
      prompt: string;
      imageUrl: string;
      timestamp: string;
    };
  }
}
