import {ProductsService} from "../products.service";
import productModel from '../../products.json';
import {setHeaders} from "../utils/setHeaders";

export const getProductsList = async () => {
    const productService = new ProductsService(productModel);
    const products = await productService.getAll();

    return {
        statusCode: 200,
        headers: setHeaders(),
        body: JSON.stringify(products)
    }
}
