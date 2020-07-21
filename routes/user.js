const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

router.post(
  '/signup',
  [
    check('name', 'name is required').notEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'password should be atleast 6 characters').isLength({
      min: 6,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array()[0].msg });
    }
    const { name, email, password } = req.body;
    User.find({ email }).exec((err, user) => {
      if (user) {
        return res.status(422).json({
          message: 'User already existed',
        });
      }
    });
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          name,
          email,
          password: hash,
        });
        user.save((err) => {
          if (err) {
            return res.status(400).json({
              message: 'Failed to create user',
            });
          }
          res.json({ message: 'User created successfully' });
        });
      }
    });
  }
);

module.exports = router;
