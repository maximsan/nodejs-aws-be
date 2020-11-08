import {setHeaders} from "../utils/setHeaders";
import {runDB} from "../utils/db";

export const getProductsList = async () => {
    const db = await runDB();

    try {
        const result = await db.query(`select s.count, p.price, p.title, p.description
                                       from products as p
                                                join stocks as s on p.id = s.product_id`)

        console.log('products', result);

        const {rows: products} = result;

        return {
            statusCode: 200,
            headers: setHeaders(),
            body: JSON.stringify(products)
        }

    } catch (error) {
        console.error(`Error during db scripts executing - ${error}`);
        return {
            statusCode: error.code,
            message: error.message
        }
    } finally {
        db.end();
    }
}
