const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  }
  catch (err) {
    res.status(422).send(err.message);
  }
});

// eslint-disable-next-line consistent-return
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  }
  catch (err) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }
});

module.exports = router;
