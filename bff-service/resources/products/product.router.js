const router = require('express').Router();
const asyncMiddleware = require('../../common/asyncErrorMiddleware');
const { CacheKey } = require('../cache.service');
const { CacheService } = require('../cache.service');
const { ProductService } = require('./product.service');

const productService = new ProductService();
const cacheService = new CacheService({});

router.route('/').get(
  asyncMiddleware(async (req, res) => {
    console.log('products');
    console.log('method', req.method);
    console.log('originalUrl', req.originalUrl);
    const { method, originalUrl } = req;

    const config = {
      method,
      url: `${process.env.products}${originalUrl}`,
    };

    console.log('config', config);

    let products;
    const cachedProducts = cacheService.get(CacheKey.PRODUCTS);
    if (cachedProducts) {
      products = cachedProducts;
    } else {
      const resolvedProducts = await productService.resolveProducts(config);
      cacheService.set(CacheKey.PRODUCTS, resolvedProducts);
      products = resolvedProducts;
    }

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
      url: `${process.env.products}${originalUrl}`,
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
      url: `${process.env.products}${originalUrl}`,
      ...(Object.keys(body).length && { data: body }),
    };

    const response = await productService.resolveProduct(config);

    console.log('response', response);

    res.status(201).send();
  }),
);

module.exports = router;
