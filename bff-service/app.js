const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./common/errorHandler');
const { BAD_GATEWAY } = require('http-status-codes');

const productRouter = require('./resources/products/product.router');
const cartRouter = require('./resources/carts/cart.router');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/', (req, res, next) => {
  const recipient = req.originalUrl.split('/')[1];
  console.log('recipient', recipient);
  const recipientUrl = process.env[recipient];

  if (!recipientUrl) {
    res.status(BAD_GATEWAY).send('Cannot process request');
  }

  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use('/products', productRouter);
app.use('/cart', cartRouter);

app.use(errorHandler);

module.exports = app;
