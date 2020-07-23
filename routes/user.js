const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//@route  POST
//@desc   to sign up a user
//@access PUBLIC
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
    User.find({ email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          return res.status(422).json({
            message: 'User already exists',
          });
        } else {
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
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
      });
  }
);

//@route  POST
//@desc   to login a user
//@access PUBLIC
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: 'ACCESS DENIED',
        });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'ACCESS DENIED',
          });
        }
        if (result) {
          const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.SECRET,
            { expiresIn: '1h' }
          );
          return res.json({
            message: 'User Logged in successfully',
            token,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
//@route  POST
//@desc   to delete a user
//@access PRIVATE
router.post('/user:id', (req, res) => {
  User.findOneAndRemove(req.params.id).exec((err, user) => {
    if (err) {
      return req.status(400).json({
        message: 'Failed to delete the user',
      });
    }
    req.json({
      message: 'User Deleted Successfully',
    });
  });
});
module.exports = router;
