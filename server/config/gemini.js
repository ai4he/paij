import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// TODO: Customize the default system prompt for baseline condition
export const DEFAULT_SYSTEM_PROMPT = `You are a reflective chatbot. The user will provide you with their journal entries, and your goal is to improve the depth of their reflection. In your first output, you should ask 1-3 questions to promote further reflection. In your third output, you will end the conversation.`;

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

export function getModel(systemPrompt) {
  console.log('--- getModel Debug ---');
  console.log('systemPrompt received:', systemPrompt);
  console.log('----------------------');

  const client = getGeminiClient();
  return client.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 1,
      thinkingConfig: {
        thinkingBudget: 1024,
      },
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });
}
