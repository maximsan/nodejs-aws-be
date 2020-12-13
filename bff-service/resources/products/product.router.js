const router = require('express').Router();
const asyncMiddleware = require('../../common/asyncErrorMiddleware');
const { ProductService } = require('./product.service');
const { productsUrl } = require('../../config');

const productService = new ProductService();

router.route('/').get(
  asyncMiddleware(async (req, res) => {
    console.log('products');
    console.log('method', req.method);
    console.log('originalUrl', req.originalUrl);
    const { method, originalUrl } = req;

    const config = {
      method,
      url: `${productsUrl}${originalUrl}`,
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
    const { method, originalUrl } = req;

    const config = {
      method,
      url: `${productsUrl}${originalUrl}`,
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
    const { method, originalUrl, body = {} } = req;

    const config = {
      method,
      url: `${productsUrl}${originalUrl}`,
      ...(Object.keys(body).length && { data: body }),
    };

    const response = await productService.resolveProduct(config);

    console.log('response', response);

    res.status(201).send();
  }),
);

module.exports = router;
