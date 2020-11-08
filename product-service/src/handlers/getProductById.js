import {setHeaders} from "../utils/setHeaders";
import {runDB} from "../utils/db";
import {errorHandler} from "../utils/errorHandler";

export const getProductById = async event => {
    const {pathParameters: {id}} = event;
    const db = await runDB();

    try {
        const { rows } = await db.query({
                text: `select p.id, p.price, p.title, p.description, s.count
                       from products as p
                                join stocks as s on p.id = s.product_id
                       where p.id = $1`,
                values: [id]
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify(rows[0]),
            headers: setHeaders()
        }
    } catch (error) {
        return errorHandler(error);
    } finally {
        db.end();
    }
};


