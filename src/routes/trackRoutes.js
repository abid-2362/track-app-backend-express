const express = require('express');
const autMiddleware = require('../middleware/authMiddleware');
const Track = require('../models/TrackModel');

const router = express.Router();
router.use(autMiddleware);

router.get('/', async (req, res) => {
  const { user } = req;
  const tracks = await Track.find({ userId: user._id }, null, null)
    .exec();
  res.send(tracks);
});

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const {
    name,
    locations
  } = req.body;

  if (!name || !locations) {
    return res.status(422)
      .send({ error: 'Please provide name and locations' });
  }

  try {
    const track = new Track({
      userId: req.user._id,
      name,
      locations
    });
    await track.save();
    res.status(200)
      .send({
        message: 'Track Saved successfully',
        error: false,
        track
      });
  } catch (err) {
    console.log(err.message); // eslint-disable-line no-console
    res.status(422)
      .send({ error: 'Something went wrong.' });
  }
});

module.exports = router;
