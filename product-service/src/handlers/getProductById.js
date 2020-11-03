import {ProductsService} from "../products.service";
import productModel from '../../products.json';
import {NotFoundError} from "../NotFoundError";
import {setHeaders} from "../utils/setHeaders";

export const getProductById = async event => {
    const productService = new ProductsService(productModel);
    const {pathParameters: {id}, headers} = event;

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
        headers: setHeaders()
    }
};


