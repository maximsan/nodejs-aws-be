const router = require('express').Router();
const asyncMiddleware = require('../../common/asyncErrorMiddleware');
const { CartService } = require('./cart.service');

const cartService = new CartService();

router.route('*').all(
  asyncMiddleware(async (req, res) => {
    console.log(req);
    console.log(req.method);
    console.log(req.originalUrl);

    const serviceUrl = process.env.carts;
    const config = {
      method: req.method,
      url: `${serviceUrl}${req.originalUrl}`,
      data: Object.keys(req.body || {}).length && req.body,
    };

    console.log('config', config);

    return await cartService.resolve(config);
  }),
);

module.exports = router;
