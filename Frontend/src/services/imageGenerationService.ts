
import Together from "together-ai";

const together = new Together({
  apiKey: "cdab2029920e1eff8368e6d4fcd827143d542f41c454f5cf505c64685859b131"
});

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

export interface EnhancedPromptResult {
  originalPrompt: string;
  enhancedPrompt: string;
}

export const enhancePromptWithLLM = async (userPrompt: string): Promise<EnhancedPromptResult> => {
  try {
    console.log("Enhancing prompt with LLM:", userPrompt);
    
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert at creating detailed, vivid image generation prompts. Extract and enhance the key visual components from the user's description. Focus on: visual elements, lighting, composition, style, atmosphere, colors, and specific details. Return only an enhanced prompt optimized for image generation, nothing else."
        },
        {
          role: "user",
          content: `Enhance this image prompt for better generation results: "${userPrompt}"`
        }
      ],
      model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      max_tokens: 200,
      temperature: 0.7
    });
    
    const enhancedPrompt = response.choices[0]?.message?.content?.trim() || userPrompt;
    console.log("Enhanced prompt received:", enhancedPrompt);
    
    return {
      originalPrompt: userPrompt,
      enhancedPrompt: enhancedPrompt
    };
  } catch (error) {
    console.error("Error enhancing prompt with LLM:", error);
    // Fallback to original prompt if LLM enhancement fails
    return {
      originalPrompt: userPrompt,
      enhancedPrompt: userPrompt
    };
  }
};

export const generateImageWithTogether = async (prompt: string): Promise<string> => {
  try {
    console.log("Generating image with prompt:", prompt);
    
    // First enhance the prompt with LLM
    const { originalPrompt, enhancedPrompt } = await enhancePromptWithLLM(prompt);
    console.log("Enhancement complete - Original:", originalPrompt, "Enhanced:", enhancedPrompt);
    
    // Store both prompts globally for the UI to access
    window.lastEnhancedPrompt = {
      original: originalPrompt,
      enhanced: enhancedPrompt
    };
    
    console.log("Stored enhanced prompt in window:", window.lastEnhancedPrompt);
    
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: enhancedPrompt,
      width: 1024,
      height: 1024,
      steps: 4,
      n: 1,
      response_format: "base64"
    });
    
    console.log("Together.AI response:", response);
    
    if (!response.data || !response.data[0] || !response.data[0].b64_json) {
      throw new Error("Invalid response from Together.AI");
    }
    
    // Convert base64 to data URL for display
    const imageDataUrl = `data:image/png;base64,${response.data[0].b64_json}`;
    console.log("Generated image data URL created successfully");
    return imageDataUrl;
  } catch (error) {
    console.error("Error generating image with Together.AI:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};

export const saveGeneratedImage = (prompt: string, imageUrl: string): GeneratedImage => {
  const image: GeneratedImage = {
    id: Date.now().toString(),
    prompt,
    imageUrl,
    timestamp: new Date()
  };
  
  // Save to localStorage for persistence
  const existingImages = getStoredImages();
  const updatedImages = [image, ...existingImages];
  localStorage.setItem('generated-images', JSON.stringify(updatedImages));
  
  return image;
};

export const getStoredImages = (): GeneratedImage[] => {
  try {
    const stored = localStorage.getItem('generated-images');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
