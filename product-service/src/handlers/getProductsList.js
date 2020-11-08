import {setHeaders} from "../utils/setHeaders";
import {runDB} from "../utils/db";

export const getProductsList = async () => {
    const db = runDB();

    try {
        const productsTable = await db.query(`
            create table if not exists products
            (
                id          uuid primary key,
                title       text not null,
                description text,
                price       integer
            )`
        );

        const stocksTable = await db.query(`
            create table stocks
            (
                id         uuid primary key,
                count      integer,
                product_id uuid,
                foreign key (product_id) references products (id)
            )`
        );
        console.log('productsTable', productsTable);
        console.log('stocksTable', stocksTable);

        const insertProducts = await db.query(`
            insert into products (title, description, price)
            values ('Guitar 1', 'Guitar 1 description', 1500),
                   ('Guitar 2', 'Guitar 2 description', 1200),
                   ('Guitar 3', 'Guitar 3 description', 2100),
                   ('Guitar 4', 'Guitar 4 description', 700),
                   ('Guitar 5', 'Guitar 5 description', 9900),
                   ('Guitar 6', 'Guitar 6 description', 17100)`
        );

        const insertStocks = await db.query(`
            insert into stocks (count, product_id)
            values (5, 'fc51ad38-17fa-413b-9c89-f45c3db06dee'),
                   (2, 'ee8b7186-3548-42a6-b61e-c01642b3a2dc'),
                   (3, '780b4f76-af2e-4779-ac2f-c86c34ed0230'),
                   (1, '11e246b5-f48b-42be-9fce-73e7b90f59bc'),
                   (2, '18176759-e9f5-41d2-9d78-b62b52c9c47e')`
        );
        console.log('insertProducts', insertProducts);
        console.log('insertStocks', insertStocks);

        const result = await db.query(`select s.count, p.price, p.title, p.description
                                             from products as p
                                                      join stocks as s on p.id = s.product_id `)

        console.log('products', result);

        const { rows: products } = result;

        return {
            statusCode: 200,
            headers: setHeaders(),
            body: JSON.stringify(products)
        }

    } catch (e) {
        console.error(`Error during db scripts executing - ${e}`);
    } finally {
        db.end();
    }
}
