import { runDB } from './utils/db';

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
                      values ($1, $2)`,
};

export class ProductRepository {
  async getAll() {
    const db = await runDB();

    try {
      const { rows: products } = await db.query(queries.getProducts);

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
      const { rows } = await db.query({
        text: queries.getProductById,
        values: [id],
      });

      if (rows?.[0]) {
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

    const products = Array.isArray(product) ? product : [product];

    try {
      for (const product of products) {
        const { title, description, price, count } = product;

        await db.query('BEGIN');

        const {
          rows: [{ id }],
        } = await db.query({
          text: queries.createProduct,
          values: [title, description, price],
        });

        console.log('created product', product);

        console.log('+++++++count', count);
        console.log('+++++++id', id);
        const result = await db.query({
          text: queries.createStockNote,
          values: [count, id],
        });

        console.log('added in stock');
        console.log('///////////////', result);

        await db.query('COMMIT');

        console.log('///////////////COMMIT');
      }
    } catch (error) {
      console.log('///////////////ROLLBACK\\\\\\\\\\\\\\');
      await db.query('ROLLBACK');
      return Promise.reject(error);
    } finally {
      db.end();
    }
  }
}
