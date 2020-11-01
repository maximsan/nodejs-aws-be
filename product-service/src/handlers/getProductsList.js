import {ProductsService} from "../products.service";
import productModel from '../../products.json';

export const getProductsList = async () => {
    const productService = new ProductsService(productModel);
    const products = await productService.getAll();

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(products)
    }
}
