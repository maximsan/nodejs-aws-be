
class ProductsService  {
    constructor(model) {
        this.model = model;
    }

    async getAll () {
        return this.model;
    }

    async get (productId) {
        return this.model.find(({id}) => id === productId)
    }
}

module.exports = ProductsService
