const axios = require('axios');

class CartService {
  async resolve(config) {
    const { data } = await axios(config);
    if (data) {
      return data;
    }
  }
}

module.exports = {
  CartService,
};
