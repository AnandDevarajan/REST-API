const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Order = require('../models/Order');

//@router   POST
//@desc     to add an order
//@access   PRIVATE
router.post(
  '/order',
  [check('id', 'Product id is empty').not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array()[0].msg });
    }
    const { id, quantity } = req.body;
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity,
      product: id,
    });
    order
      .save()
      .then(
        res.json({
          message: 'Order created successfully', 
          order,
        })
      )
      .catch((error) => {
        res.status(400).json({
          error,
        });
      });
  }
);

module.exports = router;
