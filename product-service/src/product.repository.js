import {runDB} from "./utils/db";

const queries = {
    createProduct: `insert into products (title, description, price)
                    values ($1, $2, $3)
                    returning id`,
    getProducts: `select p.id, p.price, p.title, p.description, s.count
                  from products as p
                           join stocks as s on p.id = s.product_id`,
    getProductById: `select p.id, p.price, p.title, p.description, s.count
                     from products as p
                                       join stocks as s on p.id = s.product_id
                     where p.id = $1`,
    createStockNote: `insert into stocks (count, product_id)
                   values ($1, $2)`
}

export class ProductRepository {
    async getAll() {
        const db = await runDB();

        try {
            const {rows: products} = await db.query(queries.getProducts)

            return products;
        } catch (error) {
            console.error(`Error during db scripts executing - ${error}`);
            return Promise.reject(error);
        } finally {
            db.end();
        }
    }

    async getById(id) {
        const db = await runDB();

        try {
            const {rows} = await db.query({
                    text: queries.getProductById,
                    values: [id]
                }
            );

            if (rows && rows[0]) {
                return rows[0];
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            db.end();
        }
    }

    async create(product) {
        const db = await runDB();

        try {
            const {title, description, price, count} = product;

            const {rows: products} = await db.query({
                text: queries.createProduct,
                values: [title, description, price]
            });

            console.log('created product', products);

            await db.query({
                text: queries.createStockNote,
                values: [count, products[0].id]
            })

        } catch (error) {
            return Promise.reject(error);
        } finally {
            db.end();
        }
    }
}
