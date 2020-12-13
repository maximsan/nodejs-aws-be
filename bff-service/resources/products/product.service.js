const axios = require('axios');

class ProductService {
  async resolveProducts(config) {
    const { data } = await axios(config);
    return data;
  }

  resolveProduct(config) {
    return axios(config);
  }

  async resolveProductById(config) {
    const { data } = await axios(config);
    return data;
  }
}

module.exports = {
  ProductService,
};
