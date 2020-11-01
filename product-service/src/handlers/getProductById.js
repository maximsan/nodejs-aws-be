import {ProductsService} from "../products.service";
import productModel from '../../products.json';
import {NotFoundError} from "../NotFoundError";

export const getProductById = async event => {
    const productService = new ProductsService(productModel);
    const {pathParameters: {id}, headers} = event;

    console.log('getProductById header', headers);

    let response;
    try {
        const product = await productService.get(id);
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
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
    }
};


