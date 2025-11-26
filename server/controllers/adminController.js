import db from '../config/database.js';

export const getUsers = (req, res) => {
  try {
    const users = db.prepare(
      'SELECT id, pin, system_prompt, created_at FROM users ORDER BY created_at DESC'
    ).all();

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const updatePrompts = (req, res) => {
  try {
    const { userIds, systemPrompt } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array required' });
    }

    if (!systemPrompt) {
      return res.status(400).json({ message: 'System prompt required' });
    }

    // Use a transaction for bulk update
    const updateStmt = db.prepare('UPDATE users SET system_prompt = ? WHERE id = ?');

    const updateMany = db.transaction((ids, prompt) => {
      for (const id of ids) {
        updateStmt.run(prompt, id);
      }
    });

    updateMany(userIds, systemPrompt);

    res.json({ message: `Updated ${userIds.length} user(s)` });
  } catch (error) {
    console.error('Update prompts error:', error);
    res.status(500).json({ message: 'Failed to update prompts' });
  }
};
