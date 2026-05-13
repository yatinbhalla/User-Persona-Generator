import { GoogleGenAI, Type } from "@google/genai";
import { PersonaInput, PersonaData } from '../types';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error('GEMINI_API_KEY is not defined. Please add it in the Settings > Secrets panel.');
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePersonaText = async (input: PersonaInput): Promise<PersonaData> => {
  const ai = getAI();
  const prompt = `
    Create an extremely detailed user persona infographic data based on the following inputs:
    - Target Market: ${input.targetMarket}
    - Main Goal: ${input.mainGoal}
    - Biggest Frustration: ${input.biggestFrustration}
    ${input.ageRange ? `- Age Range: ${input.ageRange}` : ''}
    ${input.occupation ? `- Specific Occupation: ${input.occupation}` : ''}
    ${input.location ? `- Geographical Location: ${input.location}` : ''}
    ${input.incomeLevel ? `- Income Level: ${input.incomeLevel}` : ''}

    The data should be comprehensive, including demographic details, behavioral traits, pain points, and a visual description for an AI photoshoot.
    If age, occupation, location, or income are provided in the inputs, the persona MUST strictly reflect those specific values. Otherwise, generate appropriate values.
    
    Output a JSON object that strictly follows the PersonaData interface.
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
          age: { type: Type.NUMBER },
          occupation: { type: Type.STRING },
          location: { type: Type.STRING },
          education: { type: Type.STRING },
          monthlyIncome: { type: Type.STRING },
          family: { type: Type.STRING },
          tagline: { type: Type.STRING, description: "A catchy archetype title (e.g., 'The Cautious Beginner')" },
          quote: { type: Type.STRING, description: "A core belief or frustration quote" },
          about: { type: Type.STRING, description: "Detailed background and bio (~100 words)" },
          behaviorAndMindset: { type: Type.ARRAY, items: { type: Type.STRING } },
          goalsAndAspirations: { type: Type.ARRAY, items: { type: Type.STRING } },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          digitalUsage: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                percentage: { type: Type.NUMBER },
                color: { type: Type.STRING, description: "Tailwind color class (e.g., 'bg-blue-500')" }
              },
              required: ["label", "percentage", "color"]
            }
          },
          financialBehavior: { type: Type.ARRAY, items: { type: Type.STRING } },
          incomeAndExpense: { 
            type: Type.OBJECT,
            properties: {
              totalIncome: { type: Type.STRING },
              totalExpenses: { type: Type.STRING },
              details: { type: Type.STRING }
            },
            required: ["totalIncome", "totalExpenses", "details"]
          },
          preferredSupport: { type: Type.ARRAY, items: { type: Type.STRING } },
          howHelp: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketSize: { type: Type.STRING, description: "Estimate of how many people fit this persona (e.g., '40-150 Million')" },
          visualDescription: { type: Type.STRING, description: "A physical description for image generation. Emphasize a natural, authentic look in a relevant setting." },
        },
        required: [
          "name", "age", "occupation", "location", "education", "monthlyIncome", "family", 
          "tagline", "quote", "about", "behaviorAndMindset", "goalsAndAspirations", 
          "painPoints", "digitalUsage", "financialBehavior", "incomeAndExpense", 
          "preferredSupport", "howHelp", "marketSize", "visualDescription"
        ],
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
  const prompt = `Realistic, high-quality photograph of ${visualDescription}. Authentic lifestyle setting, cinematic lighting, 8k resolution, highly detailed, masterwork photography. Avoid studio headshot look; aim for a natural, candid appearance.`;

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
