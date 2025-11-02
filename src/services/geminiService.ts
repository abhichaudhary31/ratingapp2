import { GoogleGenAI } from '@google/genai';

// Initialize GoogleGenAI with Vite environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set. Gemini features will not work.');
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export async function getHoroscope(sign: string): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }
  
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
       throw new Error(`The provided API key is not valid. Please check your .env file.`);
    }
    throw new Error(`Could not fetch horoscope for ${sign}. The cosmos are mysterious today.`);
  }
}
