const router = require('express').Router();
const asyncMiddleware = require('../../common/asyncErrorMiddleware');
const { ProductService } = require('./product.service');

const productService = new ProductService();

router.route('/').get(
  asyncMiddleware(async (req, res) => {
    console.log('products');
    console.log('method', req.method);
    console.log('originalUrl', req.originalUrl);

    const serviceUrl = process.env.products;
    const config = {
      method: req.method,
      url: `${serviceUrl}${req.originalUrl}`,
    };

    console.log('config', config);

    const products = await productService.resolveProducts(config);

    res.send(products);
  }),
);

router.route('/:id').get(
  asyncMiddleware(async (req, res) => {
    console.log('products');
    console.log('method', req.method);
    console.log('originalUrl', req.originalUrl);

    const serviceUrl = process.env.products;
    const config = {
      method: req.method,
      url: `${serviceUrl}${req.originalUrl}`,
    };

    console.log('config', config);

    const product = await productService.resolveProductById(config);

    res.send(product);
  }),
);

router.route('/').post(
  asyncMiddleware(async (req, res) => {
    console.log('method', req.method);
    console.log('originalUrl', req.originalUrl);
    console.log('body', req.body);

    const serviceUrl = process.env.products;
    const config = {
      method: req.method,
      url: `${serviceUrl}${req.originalUrl}`,
      data: Object.keys(req.body).length && req.body,
    };

    const response = await productService.resolveProduct(config);

    console.log('response', response);

    res.status(201).send();
  }),
);

module.exports = router;
