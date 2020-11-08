import {runDB} from "../utils/db";
import {errorHandler} from "../utils/errorHandler";
import {setHeaders} from "../utils/setHeaders";

export const createProduct = async event => {
    const {body} = event;

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`body: ${JSON.stringify(body)}`);

    const db = await runDB();
    try {
        const {title, description, price, count} = JSON.parse(body);
        const {rows: products} = await db.query({
            text: `insert into products (title, description, price)
                   values ($1, $2, $3)
                   returning id`,
            values: [title, description, price]
        });

        console.log('created product', products);

        await db.query({
            text: `insert into stocks (count, product_id)
                   values ($1, $2)`,
            values: [count, products[0].id]
        })

        return {
            statusCode: 201,
            headers: setHeaders(),
        }
    } catch (error) {
        return errorHandler(error);
    } finally {
        db.end();
    }
}
