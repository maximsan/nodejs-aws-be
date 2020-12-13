const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '.env'),
});

module.exports = {
  PORT: process.env.port,
  products: process.env.products,
  carts: process.env.carts,
};
