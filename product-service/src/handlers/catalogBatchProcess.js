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

const ProductRepo = new ProductRepository();
const ProductServ = new ProductService(ProductRepo);

export const catalogBatchProcess = middy(async (event) => {
    const {Records: products} = event

    const sns = new SNS({region: 'eu-west-1'})

    const deserializedProducts = JSON.parse(products);

    for (const product of deserializedProducts) {
        try {
            validate(productSchema, product)

            await ProductServ.create(product);

            // const snsParams = {
            //     Subject: `Product was added`,
            //     Message: JSON.stringify(product),
            //     TopicArn: SNS_ARN,
            // }
            // await sns.publish(snsParams).promise()

            return createResponse(StatusCodes.OK, JSON.stringify(product));
        } catch (error) {
            return errorHandler(error);
        }
    }

    return createResponse(StatusCodes.CREATED);

}).use(cors())
