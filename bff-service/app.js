const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./common/errorHandler');

const productRouter = require('./resources/products/product.router');
const cartRouter = require('./resources/carts/cart.router');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/products', productRouter);
app.use('/carts', cartRouter);

app.use(errorHandler);

module.exports = app;
