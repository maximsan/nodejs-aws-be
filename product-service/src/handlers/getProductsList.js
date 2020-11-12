import {runDB} from "../utils/db";
import {errorHandler} from "../utils/errorHandler";
import {createResponse} from "../utils/createResponse";

export const getProductsList = async event => {
    const db = await runDB();

    console.log(`event: ${JSON.stringify(event)}`);

    try {
        const {rows: products} = await db.query(`select p.id, p.price, p.title, p.description, s.count 
                                       from products as p
                                                join stocks as s on p.id = s.product_id`)
        return createResponse(200, products);
    } catch (error) {
        console.error(`Error during db scripts executing - ${error}`);
        return errorHandler(error);
    } finally {
        db.end();
    }
}
