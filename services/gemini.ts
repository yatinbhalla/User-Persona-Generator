import { GoogleGenAI, Type } from "@google/genai";
import { PersonaInput, PersonaData } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

export const generatePersonaText = async (input: PersonaInput): Promise<PersonaData> => {
  const ai = getAI();
  const prompt = `
    Create a detailed user persona based on the following inputs:
    - Target Market: ${input.targetMarket}
    - Main Goal: ${input.mainGoal}
    - Biggest Frustration: ${input.biggestFrustration}

    Output a JSON object with:
    1. "name": A realistic, professional fictional name.
    2. "bio": A compelling 100-word biography describing their background, role, and how their frustration affects their work towards their goal.
    3. "visualDescription": A concise but descriptive physical description of the person (e.g., "Middle-aged woman with glasses and short curly hair, wearing a business blazer") suitable for an image generator.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          bio: { type: Type.STRING },
          visualDescription: { type: Type.STRING },
        },
        required: ["name", "bio", "visualDescription"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from text generation model");
  }

  return JSON.parse(text) as PersonaData;
};

export const generatePersonaImage = async (visualDescription: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Professional headshot of ${visualDescription}, high quality, photorealistic, studio lighting, neutral background`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  let imageUrl = "";
  
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Image = part.inlineData.data;
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64Image}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    // Fallback if image generation fails or is filtered
    return "https://picsum.photos/400/400";
  }

  return imageUrl;
};
