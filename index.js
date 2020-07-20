require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const mongoose = require('mongoose');
const app = express();

const port = process.env.port || 3000;

mongoose
  .connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('DB CONNECTED'))
  .catch((err) => console.log(err.message));

app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
