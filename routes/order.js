const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Order = require('../models/Order');

//@router   GET
//@desc     to get all orders
//@access   PRIVATE
router.get('/order', (req, res) => {
  Order.find()
    .select('-__v')
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          message: 'No Order found',
        });
      }
      return res.json({
        message: 'Your Orders',
        orders,
      });
    });
});

//@router   GET
//@desc     to get an individual order
//@access   PRIVATE
router.get('/order/:id', (req, res) => {
  Order.findById(req.params.id)
    .select('-__v')
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          message: 'Order not found',
        });
      }
      res.json(order);
    });
});

//@router   POST
//@desc     to add an order
//@access   PRIVATE
router.post(
  '/order',
  [check('id', 'Product id is empty').notEmpty()],
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
