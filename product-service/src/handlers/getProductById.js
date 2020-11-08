import {NotFoundError} from "../NotFoundError";
import {setHeaders} from "../utils/setHeaders";
import {runDB} from "../utils/db";

export const getProductById = async event => {
    const {pathParameters: {id}} = event;
    const db = runDB();

    let response;
    try {
        const product = await db.query({
                text: `select s.count, p.price, p.title, p.description
                       from products as p
                                join stocks as s on p.id = s.product_id
                       where p.id = $1`,
                values: [id]
            }
        );

        response = {
            statusCode: 200,
            body: JSON.stringify(product),
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
    }

    return {
        ...response,
        headers: setHeaders()
    }
};


