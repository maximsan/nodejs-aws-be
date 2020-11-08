import {setHeaders} from "../utils/setHeaders";
import {runDB} from "../utils/db";

export const getProductsList = async () => {
    const db = await runDB();

    try {
        const {rows: products} = await db.query(`select p.id, p.price, p.title, p.description, s.count 
                                       from products as p
                                                join stocks as s on p.id = s.product_id`)
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
