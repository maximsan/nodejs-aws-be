import { runDB } from './db/db';
import { queries } from './db/queries';

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

        console.log('**********BEGIN**********');

        await db.query('BEGIN');

        const {
          rows: [{ id }],
        } = await db.query({
          text: queries.createProduct,
          values: [title, description, price],
        });

        console.log('created product');
        console.log(`**********${product}**********`);

        const result = await db.query({
          text: queries.createStockNote,
          values: [count, id],
        });

        console.log('added in stock');
        console.log(`**********${result}**********`);

        await db.query('COMMIT');

        console.log('**********COMMIT**********');
      }
    } catch (error) {
      console.log('**********ROLLBACK**********');
      await db.query('ROLLBACK');
      return Promise.reject(error);
    } finally {
      db.end();
    }
  }
}
