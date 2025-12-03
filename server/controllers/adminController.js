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

export const getEntries = (req, res) => {
  try {
    const { userIds } = req.query;

    console.log('getEntries called with userIds:', userIds);

    if (!userIds) {
      return res.status(400).json({ message: 'User IDs required' });
    }

    const ids = userIds.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

    console.log('Parsed IDs:', ids);

    if (ids.length === 0) {
      return res.status(400).json({ message: 'Valid user IDs required' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const query = `
      SELECT e.id, e.user_id, e.content, e.created_at, u.pin
      FROM entries e
      JOIN users u ON e.user_id = u.id
      WHERE e.user_id IN (${placeholders})
      ORDER BY e.created_at DESC
    `;

    console.log('Executing query:', query);

    const entries = db.prepare(query).all(...ids);

    console.log('Found entries:', entries.length);

    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
};

export const deleteEntries = (req, res) => {
  try {
    const { entryIds, userIds, deleteAll } = req.body;

    let deletedCount = 0;

    if (deleteAll && userIds && Array.isArray(userIds) && userIds.length > 0) {
      // Delete all entries for specified users
      const deleteConversations = db.prepare('DELETE FROM conversations WHERE entry_id IN (SELECT id FROM entries WHERE user_id = ?)');
      const deleteUserEntries = db.prepare('DELETE FROM entries WHERE user_id = ?');

      const deleteAllForUsers = db.transaction((ids) => {
        for (const id of ids) {
          deleteConversations.run(id);
          const result = deleteUserEntries.run(id);
          deletedCount += result.changes;
        }
      });

      deleteAllForUsers(userIds);
    } else if (entryIds && Array.isArray(entryIds) && entryIds.length > 0) {
      // Delete specific entries
      const deleteConversation = db.prepare('DELETE FROM conversations WHERE entry_id = ?');
      const deleteEntry = db.prepare('DELETE FROM entries WHERE id = ?');

      const deleteSpecific = db.transaction((ids) => {
        for (const id of ids) {
          deleteConversation.run(id);
          const result = deleteEntry.run(id);
          deletedCount += result.changes;
        }
      });

      deleteSpecific(entryIds);
    } else {
      return res.status(400).json({ message: 'Entry IDs or user IDs with deleteAll flag required' });
    }

    res.json({ message: `Deleted ${deletedCount} entry(ies)`, deletedCount });
  } catch (error) {
    console.error('Delete entries error:', error);
    res.status(500).json({ message: 'Failed to delete entries' });
  }
};
