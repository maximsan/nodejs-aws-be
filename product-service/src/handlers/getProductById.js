import {errorHandler} from "../../error/errorHandler";
import {createResponse} from "../../error/createResponse";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import {StatusCodes} from "http-status-codes";
import {ProductRepository} from "../product.repository";
import {ProductService} from "../product.service";

const ProductRepo = new ProductRepository();
const ProductServ = new ProductService(ProductRepo);

export const getProductById = middy(async event => {
    const {pathParameters: {id}} = event;

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`id: ${JSON.stringify(id)}`);

    try {
        const product = await ProductServ.getById(id);

        if (product) {
            return createResponse(StatusCodes.OK, product);
        }

        return createResponse(StatusCodes.NOT_FOUND, `Product not found by id ${id}`);
    } catch (error) {
        return errorHandler(error);
    }
}).use(cors());


