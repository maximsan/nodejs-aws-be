import middy from "@middy/core";
import inputOutputLogger from '@middy/input-output-logger';
import cors from "@middy/http-cors";
import {errorHandler} from "../../../shared/error";
import {createResponse} from "../../../shared/createResponse";
import {StatusCodes} from "http-status-codes";
import {ProductRepository} from "../product.repository";
import {ProductService} from "../product.service";
import {SnsService} from "../sns.service";
import {validate} from "../utils/validate";
import {productSchema} from "../utils/product.validation.schema";

const ProductRepo = new ProductRepository();
const ProductServ = new ProductService(ProductRepo);
const SnsServ = new SnsService();

export const catalogBatchProcess = middy(async (event) => {
    const {Records = []} = event;

    console.log(`records to process ${Records.length}`);

    const products = [];
    for (const record of Records) {
        try {
            const product = JSON.parse(record.body);

            const validProduct = validate(productSchema, product);

            console.log(`product ${JSON.stringify(validProduct)}`)

            products.push(validProduct);
        } catch (error) {
            console.log('Error during products reading');
            return errorHandler(error);
        }
    }

    if (!products.length) {
        return createResponse(StatusCodes.ACCEPTED, "Nothing to save");
    }

    try {
        console.log('------products------', products);
        await ProductServ.create(products);
    } catch (error) {
        console.log('Error during product creation');
        return errorHandler(error);
    }

    try {
        await SnsServ.send(products);
    } catch (error) {
        console.log('Error during notification publishing')
        return errorHandler(error);
    }

    return createResponse(StatusCodes.CREATED);
})
    .use(cors())
    .use(inputOutputLogger())
