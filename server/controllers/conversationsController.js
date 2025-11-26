import db from '../config/database.js';

export const getConversation = (req, res) => {
  try {
    const { entryId } = req.params;

    const conversation = db.prepare(
      'SELECT * FROM conversations WHERE entry_id = ?'
    ).get(entryId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Parse the JSON messages
    conversation.messages = JSON.parse(conversation.messages);

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
};

export const saveConversation = (req, res) => {
  try {
    const { entryId, userId, messages } = req.body;

    if (!entryId || !userId || !messages) {
      return res.status(400).json({ message: 'Entry ID, user ID, and messages required' });
    }

    const result = db.prepare(
      'INSERT INTO conversations (entry_id, user_id, messages) VALUES (?, ?, ?)'
    ).run(entryId, userId, JSON.stringify(messages));

    const conversation = db.prepare('SELECT * FROM conversations WHERE id = ?').get(result.lastInsertRowid);
    conversation.messages = JSON.parse(conversation.messages);

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Save conversation error:', error);
    res.status(500).json({ message: 'Failed to save conversation' });
  }
};
