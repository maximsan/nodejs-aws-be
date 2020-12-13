const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '.env'),
});

module.exports = {
  PORT: process.env.port || 4000,
  productsUrl: process.env.products,
  cartUrl: process.env.cart,
};
