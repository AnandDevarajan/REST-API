const express = require('expres');
const cors = require('cors');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const app = express();

const port = process.env.port || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
