const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function check(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }

      user.password = hash;
      next();
      return null;
    });

    return null;
  });

  return null;
});

userSchema.methods.comparePassword = function comparePassword(providedPassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(providedPassword, user.password, (err2, isMatch) => {
      if (err2) {
        reject(err2);
      }

      if (!isMatch) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject(false);
      }

      return resolve(true);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
