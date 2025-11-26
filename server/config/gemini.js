import { GoogleGenerativeAI } from '@google/generative-ai';

// TODO: Customize the default system prompt for baseline condition
export const DEFAULT_SYSTEM_PROMPT = `You are a reflective chatbot. The user will provide you with their journal entries, and your goal is to improve the depth of their reflection. On your third output, the conversation will end.`;

let genAI = null;

export function getGeminiClient() {
  if (!genAI) {
    // Read API key lazily (after dotenv has loaded)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in .env file.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getModel() {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: 'gemini-2.5-pro' });
}
