import {setHeaders} from "../utils/setHeaders";
import {runDB} from "../utils/db";
import {errorHandler} from "../utils/errorHandler";

export const getProductsList = async event => {
    const db = await runDB();

    console.log(`event: ${JSON.stringify(event)}`);

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
        errorHandler(error);
    } finally {
        db.end();
    }
}
