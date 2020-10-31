'use strict';

const productModel = require('./products.json');
const ProductsService = require("./products.service");

module.exports.getProductById = async event => {
    const productService = new ProductsService(productModel);
    const {pathParameters: {id}} = event;

    let response;
    try {
        const product = await productService.get(id);
        response = {
            statusCode: 200,
            body: JSON.stringify(product),
        };
    } catch (error) {
        response = {
            statusCode: error.code,
            message: error.message
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

module.exports.getProductsList = async () => {
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
