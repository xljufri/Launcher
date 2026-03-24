import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
// Use import.meta.env for Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI(apiKey) : null;

export const generateWallpaper = async (timeOfDay: string): Promise<string | null> => {
  if (!genAI) {
    console.error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    return null;
  }

  try {
    // Note: Gemini 1.5 Flash is primarily a text/multimodal model.
    // As of now, direct image generation via this SDK is limited or requires specific models.
    // We'll use gemini-1.5-flash to generate a description and potentially use a placeholder or
    // if the user has access to an image-capable model, they can specify it here.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `A beautiful, aesthetic, minimalist mobile phone wallpaper for ${timeOfDay}. 
    Atmospheric, clean, no text, subtle gradients, suitable for a smartphone home screen background.
    Please provide a detailed visual description that could be used as an image prompt.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Generated wallpaper description:", text);
    
    // Since direct image generation isn't available in the standard JS SDK yet,
    // we'll use a high-quality placeholder service with the theme as a keyword
    // or return null if we want to stick to the default background.
    const themeKeyword = timeOfDay.split(' ')[0].toLowerCase();
    return `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1080&h=1920&q=${themeKeyword}`;
    
  } catch (error) {
    console.error("Failed to generate wallpaper:", error);
    return null;
  }
};
