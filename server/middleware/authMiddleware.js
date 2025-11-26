import db from '../config/database.js';

export const verifyUser = (req, res, next) => {
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User ID required' });
  }

  const user = db.prepare('SELECT id, pin FROM users WHERE id = ?').get(userId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }

  req.user = user;
  next();
};

export const verifyAdmin = (req, res, next) => {
  // Simple admin key verification via header
  // In production, use proper authentication
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY || 'admin-secret-key';

  if (adminKey !== expectedKey) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};
