
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client with the API key from environment variables
// Using Vite's import.meta.env for frontend environment access
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getTacticalInsights = async (contextItems: string[]) => {
  // Return fallback if API key is not configured
  if (!apiKey || !ai) {
    console.warn("Gemini API key not configured - returning fallback insights");
    return {
      fastMovingItems: ["Camphor (100g)", "Deepa Oil (800ml)"],
      marketLogic: "Daily ritual consumables have the highest repeat purchase rate.",
      recommendedAction: "Stock 1-month consumable bundles."
    };
  }

  try {
    const contextString = contextItems.length > 0 
      ? `User is currently interested in: ${contextItems.join(', ')}.` 
      : `User is looking for high-velocity daily pooja essentials.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
        Act as a wholesale inventory analyst for a local retailer.
        ${contextString}
        
        Provide one specific sourcing recommendation. 
        1. List 2-3 specific items that are selling fast right now based on this context.
        2. Explain WHY in 1 short sentence (practical reason only, no philosophy).
        3. Give 1 clear action command (e.g., "Bundle X with Y").

        Keep it extremely concise. No storytelling. No fluff.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fastMovingItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 specific product names"
            },
            marketLogic: { 
              type: Type.STRING,
              description: "One sentence explaining demand" 
            },
            recommendedAction: { 
              type: Type.STRING, 
              description: "One short command" 
            }
          },
          required: ["fastMovingItems", "marketLogic", "recommendedAction"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API call failed:", error instanceof Error ? error.message : String(error));
    console.warn("Returning fallback insights due to Gemini API error");
    // Fallback static data if API fails - does NOT block payment or checkout
    return {
      fastMovingItems: ["Camphor (100g)", "Deepa Oil (800ml)"],
      marketLogic: "Daily ritual consumables have the highest repeat purchase rate.",
      recommendedAction: "Stock 1-month consumable bundles."
    };
  }
};
