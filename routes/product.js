const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

//@router   GET
//@desc     to get all products
//@access   PUBLIC
router.get('/product', (req, res) => {
  Product.find().exec((err, products) => {
    if (err) {
      return res.status(400).json({
        error: 'Products Not Found',
      });
    }
    return res.json(products);
  });
});

//@router   GET
//@desc     to get an individual product
//@access   PUBLIC
router.get('/product/:id', (req, res) => {
  Product.findById(req.params.id).exec((err, product) => {
    if (!product) {
      return res.status(500).json({
        message: 'Product Not Found',
      });
    }
    return res.json(product);
  });
});

//@router   POST
//@desc     to create a product
//@access   PRIVATE
router.post(
  '/product',
  [
    check('name', 'Name is required').notEmpty(),
    check('price', 'Price is required').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array()[0].msg });
    }
    const { name, price } = req.body;
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name,
      price,
    });
    product
      .save()
      .then(
        res.json({
          message: 'Product Created Successfully',
          product,
        })
      )
      .catch(
        res.status(400).json({
          error: 'Product creation Failed',
        })
      );
  }
);

module.exports = router;
