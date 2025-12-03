import db from '../config/database.js';

export const getEntries = (req, res) => {
  try {
    const { userId, date } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    let query = 'SELECT * FROM entries WHERE user_id = ?';
    const params = [userId];

    if (date) {
      query += ' AND entry_date = ?';
      params.push(date);
    }

    query += ' ORDER BY entry_timestamp DESC';

    const entries = db.prepare(query).all(...params);
    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Failed to fetch entries' });
  }
};

// Transaction to atomically get next entry number and insert entry
// Prevents race condition when same user creates entries from multiple devices
const createEntryTransaction = db.transaction((userId, content, entryDate) => {
  const lastEntry = db.prepare(
    'SELECT MAX(entry_number) as max_num FROM entries WHERE user_id = ?'
  ).get(userId);
  const entryNumber = (lastEntry?.max_num || 0) + 1;

  const result = db.prepare(
    'INSERT INTO entries (user_id, entry_number, content, entry_date) VALUES (?, ?, ?, ?)'
  ).run(userId, entryNumber, content, entryDate);

  return db.prepare('SELECT * FROM entries WHERE id = ?').get(result.lastInsertRowid);
});

export const createEntry = (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: 'User ID and content required' });
    }

    const entryDate = new Date().toISOString().split('T')[0];

    const entry = createEntryTransaction(userId, content, entryDate);

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Failed to create entry' });
  }
};

export const getEntry = (req, res) => {
  try {
    const { id } = req.params;

    const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({ message: 'Failed to fetch entry' });
  }
};
