export class ProductService  {
    constructor(repository) {
        this.repository = repository;
    }

    async getAll () {
        return this.repository.getAll();
    }

    async getById (id) {
        return this.repository.getById(id);
    }

    async create(product) {
        return this.repository.create(product);
    }
}
