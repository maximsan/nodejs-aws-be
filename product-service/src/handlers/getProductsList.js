import {runDB} from "../utils/db";
import {errorHandler} from "../../../shared/errorHandler";
import {createResponse} from "../../../shared/createResponse";

export const getProductsList = async event => {
    console.log(`event: ${JSON.stringify(event)}`);

    const db = await runDB();

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
