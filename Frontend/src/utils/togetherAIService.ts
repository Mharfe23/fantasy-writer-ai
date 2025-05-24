import Together from "together-ai";

// Initialize Together AI client with the direct API key
const TOGETHER_API_KEY = "62f708240a103903a27573d186eef9c365477a6c7e043846aa504ca8a98c8a43";

// Log API key status
console.log("API Key loaded:", TOGETHER_API_KEY ? "Yes" : "No");
console.log("API Key length:", TOGETHER_API_KEY.length);

// Initialize Together AI client
const together = new Together({ apiKey: TOGETHER_API_KEY });

/**
 * Extract keywords from text using Llama 3.3 model
 */
export const extractKeywords = async (text: string): Promise<string> => {
  try {
    const prompt = `
I'm creating an AI image based on the following text. Please extract 5-10 key visual elements, 
describing them with rich detail, atmosphere, and style information. Format as a single paragraph
that would make a good prompt for a fantasy art image generator:

"${text}"`;

    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error extracting keywords:", error);
    throw new Error("Failed to extract keywords from text");
  }
};

/**
 * Generate an image using the FLUX.1-schnell model
 */
export const generateImage = async (prompt: string, width = 1024, height = 1024): Promise<string> => {
  try {
    console.log("Generating image with prompt:", prompt);
    
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: prompt,
      width: width,
      height: height,
      steps: 4,
      n: 1,
      response_format: "base64",
    });

    console.log("API Response:", {
      hasData: !!response.data,
      dataLength: response.data?.length,
      firstItem: response.data?.[0],
      hasB64Json: !!response.data?.[0]?.b64_json
    });

    if (!response.data?.[0]?.b64_json) {
      throw new Error("No image data in response");
    }

    return response.data[0].b64_json;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}; 