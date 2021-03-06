const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

//@router   GET
//@desc     to get all products
//@access   PUBLIC
router.get('/product', (req, res) => {
  Product.find()
    .select('-__v')
    .exec((err, products) => {
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
    if (err) {
      return res.status(400).json({
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
    check('price', 'Price is required').notEmpty().isNumeric(),
  ],
  upload.single('productImage'),
  (req, res) => {
    console.log(req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array()[0].msg });
    }
    const { name, price } = req.body;
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name,
      price,
      productImage: req.file.path,
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

//@router   PUT
//@desc     to update a product
//@access   PRIVATE
router.put('/product/:id', (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .select('-__v')
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          message: 'Product failed to update',
        });
      }
      return res.json({
        message: 'Product updated successfully',
        product,
      });
    });
});

//@router   DELETE
//@desc     to delete a product
//@access   PRIVATE
router.delete('/product/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id).exec((err, product) => {
    if (!product) {
      return res.status(400).json({
        message: 'Failed to delete the product',
      });
    }
    return res.json({
      message: 'Product deleted successfully',
    });
  });
});

module.exports = router;
