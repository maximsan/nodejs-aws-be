import {runDB} from "../utils/db";
import {errorHandler} from "../../error/errorHandler";
import {createResponse} from "../../error/createResponse";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import {StatusCodes} from "http-status-codes";

export const getProductById = middy(async event => {
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
            return createResponse(StatusCodes.OK, rows[0]);
        }

        return createResponse(StatusCodes.NOT_FOUND, `Product not found by id ${id}`);
    } catch (error) {
        return errorHandler(error);
    } finally {
        db.end();
    }
}).use(cors());


