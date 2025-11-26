import db from '../config/database.js';
import { getModel, DEFAULT_SYSTEM_PROMPT } from '../config/gemini.js';

export const sendMessage = async (req, res) => {
  try {
    const { userId, messages } = req.body;

    if (!userId || !messages) {
      return res.status(400).json({ message: 'User ID and messages required' });
    }

    // Get user's system prompt
    const user = db.prepare('SELECT system_prompt FROM users WHERE id = ?').get(userId);
    const systemPrompt = user?.system_prompt || DEFAULT_SYSTEM_PROMPT;

    // Get the Gemini model
    const model = getModel();

    // Build conversation history for Gemini
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    });

    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;

    // Send message and get response
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    const text = response.text();

    res.json({ content: text, role: 'assistant' });
  } catch (error) {
    console.error('Chat error:', error);

    if (error.message.includes('API key')) {
      return res.status(503).json({ message: 'Chat service not configured. Please add Gemini API key.' });
    }

    res.status(500).json({ message: 'Failed to get response from AI' });
  }
};
