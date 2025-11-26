import db from '../config/database.js';

// Generate a random 4-digit PIN
function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Generate a unique PIN that doesn't exist in the database
function generateUniquePin() {
  let pin;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    pin = generatePin();
    const existing = db.prepare('SELECT id FROM users WHERE pin = ?').get(pin);
    if (!existing) break;
    attempts++;
  } while (attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique PIN');
  }

  return pin;
}

export const login = (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: 'Invalid PIN format' });
    }

    const user = db.prepare('SELECT id, pin, created_at FROM users WHERE pin = ?').get(pin);

    if (!user) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    res.json({ id: user.id, pin: user.pin });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const register = (req, res) => {
  try {
    const pin = generateUniquePin();

    const result = db.prepare('INSERT INTO users (pin) VALUES (?)').run(pin);

    res.status(201).json({
      id: result.lastInsertRowid,
      pin: pin,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to generate PIN' });
  }
};
