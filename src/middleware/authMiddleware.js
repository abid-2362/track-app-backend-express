const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const { userId } = payload;
    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
