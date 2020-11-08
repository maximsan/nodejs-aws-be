import {NotFoundError} from "../NotFoundError";
import {setHeaders} from "../utils/setHeaders";
import {runDB} from "../utils/db";

export const getProductById = async event => {
    const {pathParameters: {id}} = event;
    const db = await runDB();

    let response;
    try {
        const { rows } = await db.query({
                text: `select p.id, p.price, p.title, p.description, s.count
                       from products as p
                                join stocks as s on p.id = s.product_id
                       where p.id = $1`,
                values: [id]
            }
        );

        response = {
            statusCode: 200,
            body: JSON.stringify(rows[0]),
        };
    } catch (error) {
        if (error instanceof NotFoundError) {
            response = {
                statusCode: 404,
                message: error.message,
            }
        } else {
            response = {
                statusCode: error.code,
                message: error.message
            }
        }
    } finally {
        db.end();
    }

    return {
        ...response,
        headers: setHeaders()
    }
};


