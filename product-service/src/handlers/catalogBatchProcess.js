import middy from "@middy/core";
import cors from "@middy/http-cors";
import {errorHandler} from "../../error/errorHandler";
import {createResponse} from "../../error/createResponse";
import {StatusCodes} from "http-status-codes";
import {ProductRepository} from "../product.repository";
import {ProductService} from "../product.service";
import {validate} from "../utils/validate";
import {productSchema} from "../utils/product.validation.schema";
import {SNS} from 'aws-sdk';
import {CATALOG_ITEMS_ADD_SUBSCRIPTION} from "../config";

const ProductRepo = new ProductRepository();
const ProductServ = new ProductService(ProductRepo);

export const catalogBatchProcess = middy(async (event) => {
    const {Records = []} = event;

    console.log(`catalogBatchProcess event ${JSON.stringify(event)}`);

    const sns = new SNS({region: 'eu-west-1'});

    const products = [];
    for (const record of Records) {
        try {
            const product = JSON.parse(record.body);

            console.log(`product ${JSON.stringify(product)}`)

            products.push(product);
            // validate(productSchema, product)

        } catch (error) {
            console.log('Error during product reading');
            return errorHandler(error);
        }
    }

    if (!products.length) {
        return createResponse(StatusCodes.ACCEPTED, "Nothing to save");
    }

    try {
        await ProductServ.create(products);
    } catch (error) {
        console.log('Error during product creation');
        return errorHandler(error);
    }

    try {
        const snsParams = {
            Subject: `Product was added`,
            Message: JSON.stringify(products),
            TopicArn: CATALOG_ITEMS_ADD_SUBSCRIPTION,
        };

        console.log(`snsParams ${JSON.stringify(snsParams)}`);

        await sns.publish(snsParams).promise();
    } catch (error) {
        console.log('Error during notification publishing')
        return errorHandler(error);
    }

    return createResponse(StatusCodes.CREATED);
}).use(cors())
