import { GoogleGenerativeAI } from '@google/generative-ai';

// TODO: Add your Gemini API key to the .env file as GEMINI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

// TODO: Customize the default system prompt for baseline condition
export const DEFAULT_SYSTEM_PROMPT = `You are a reflective chatbot. The user will provide you with their journal entries, and your goal is to improve the depth of their reflection. On your third output, the conversation will end.`;

let genAI = null;

export function getGeminiClient() {
  if (!genAI) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in .env file.');
    }
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

export function getModel() {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: 'gemini-2.5-pro-preview-05-06' });
}
