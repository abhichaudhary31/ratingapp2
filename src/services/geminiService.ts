import { GoogleGenAI } from '@google/genai';

// FIX: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY and remove the manual key check.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getHoroscope(sign: string): Promise<string> {
  try {
    const prompt = `Provide a brief horoscope for the zodiac sign ${sign} for tomorrow.. Keep it under 100 words.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error(`Error fetching horoscope for ${sign}:`, error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error(`The provided API key is not valid. Please check your Vercel environment variables.`);
    }
    throw new Error(`Could not fetch horoscope for ${sign}. The cosmos are mysterious today.`);
  }
}