const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
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
router.get('/product/:id', (req, res) => {});

//@router   POST
//@desc     to create a product
//@access   PRIVATE
router.post('/product', (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
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
});

module.exports = router;
