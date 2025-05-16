
const jwt     = require('jsonwebtoken');
const User    = require('../models/Users');
const JWT_SECRET = process.env.JWT_SECRET;

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ status: 'error', message: 'Missing Authorization header' });
    }
    const token = header.replace(/^Bearer\s+/i, '');
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};


module.exports = { requireAuth };