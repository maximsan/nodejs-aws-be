import {NotFoundError} from "../error/NotFoundError";

export class ProductsService  {
    constructor(model) {
        this.model = model;
    }

    async getAll () {
        return this.model;
    }

    async get (productId) {
        const product = this.model.find(({id}) => id === productId)
        if (!product) {
            throw new NotFoundError('Product not found')
        }

        return product;
    }
}
