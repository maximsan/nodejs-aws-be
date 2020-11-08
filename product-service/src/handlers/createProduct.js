import {runDB} from "../utils/db";
import {errorHandler} from "../utils/errorHandler";
import {setHeaders} from "../utils/setHeaders";

export const createProduct = async event => {
    const {body} = event;
    const db = await runDB();

    try {
        const {title, description, price, count} = JSON.parse(body);
        const {rows} = await db.query({
            text: `insert into products
                   values ($1, $2, $3)`,
            values: [title, description, price]
        });

        const { id } = rows[0];

        const result = await db.query({
            text: `insert into stocks as s values($1, $2)`,
            values: [count, id]
        })

        console.log(result);

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
}
