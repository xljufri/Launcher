import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateWallpaper = async (timeOfDay: string): Promise<string | null> => {
  try {
    const prompt = `A beautiful, aesthetic, minimalist mobile phone wallpaper for ${timeOfDay}. Atmospheric, clean, no text, subtle gradients, suitable for a smartphone home screen background.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
          imageSize: "1K"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to generate wallpaper:", error);
    return null;
  }
};
