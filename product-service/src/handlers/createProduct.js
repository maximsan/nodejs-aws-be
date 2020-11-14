import {runDB} from "../utils/db";
import {errorHandler} from "../../../shared/errorHandler";
import {productSchema} from "../utils/product.validation.schema";
import {validate} from "../utils/validate";
import {createResponse} from "../../../shared/createResponse";

export const createProduct = async (event) => {
    const {body} = event;

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`body: ${JSON.stringify(body)}`);

    const db = await runDB();
    const deserializedBody = JSON.parse(body);

    try {
        validate(productSchema, deserializedBody)

        const {title, description, price, count} = deserializedBody;

        const {rows: products} = await db.query({
            text: `insert into products (title, description, price)
                   values ($1, $2, $3)
                   returning id`,
            values: [title, description, price]
        });

        console.log('created product', products);

        await db.query({
            text: `insert into stocks (count, product_id)
                   values ($1, $2)`,
            values: [count, products[0].id]
        })

        return createResponse(201);
    } catch (error) {
        return errorHandler(error);
    } finally {
        db.end();
    }
}
