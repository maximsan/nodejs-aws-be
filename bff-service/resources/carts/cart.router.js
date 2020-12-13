const router = require('express').Router();
const asyncMiddleware = require('../../common/asyncErrorMiddleware');
const { CartService } = require('./cart.service');

const cartService = new CartService();

router.route('*').all(
  asyncMiddleware(async (req, res) => {
    console.log('cart');
    console.log('method', req.method);
    console.log('originalUrl', req.originalUrl);
    const { method, originalUrl, body = {} } = req;

    const config = {
      method,
      url: `${process.env.cart}${originalUrl}`,
      ...(Object.keys(body).length && { data: body }),
    };

    console.log('config', config);

    const result = await cartService.resolve(config);

    res.send(result);
  }),
);

module.exports = router;
