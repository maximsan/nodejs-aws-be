import {runDB} from "../utils/db";
import {errorHandler} from "../utils/errorHandler";
import {createResponse} from "../utils/createResponse";

export const getProductById = async event => {
    const {pathParameters: {id}} = event;

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`id: ${JSON.stringify(id)}`);

    const db = await runDB();
    try {
        const {rows} = await db.query({
                text: `select p.id, p.price, p.title, p.description, s.count
                       from products as p
                                join stocks as s on p.id = s.product_id
                       where p.id = $1`,
                values: [id]
            }
        );

        if (rows && rows[0]) {
            return createResponse(200, rows[0]);
        }

        return createResponse(404, `Product not found by id ${id}`);
    } catch (error) {
        return errorHandler(error);
    } finally {
        db.end();
    }
};


