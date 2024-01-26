const express = require('express');
const autMiddleware = require('../middleware/authMiddleware');
const Track = require('../models/TrackModel');

const router = express.Router();
router.use(autMiddleware);

router.get('/', async (req, res) => {
  const { user } = req;
  const tracks = await Track.find({ userId: user._id });
  res.send(tracks);
});

module.exports = router;
