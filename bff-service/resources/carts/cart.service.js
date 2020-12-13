const axios = require('axios');

class CartService {
  async resolve(config) {
    console.log('start CartService resolve');
    const { data } = await axios(config);
    console.log('CartService data', data);
    if (data) {
      return data;
    }
  }
}

module.exports = {
  CartService,
};
