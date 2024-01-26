// require('./models/UserModel');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const utils = require('./utils/utils');
require('dotenv').config();

// import * as mongoose from 'mongoose';

const app = express();

app.use(bodyParser.json());

// Auth Routes
app.use(authRoutes);

// Track Routes
app.use('/tracks', trackRoutes);

const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri).catch(utils.emptyErrorHandler);
mongoose.connection.on('connected', () => {
  // eslint-disable-next-line no-console
  console.log('mongodb connected');
});
mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.log('Error connecting to mongodb', err);
});

app.get('/', authMiddleware, (req, res) => {
  res.send(`Hi ${req.user.email}`);
});

const PORT = 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on ${PORT}`);
});
