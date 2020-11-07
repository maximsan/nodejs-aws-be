import lambdaTester from 'lambda-tester';
import {getProductsList} from "./getProductsList";
import productModel from '../../products.json';

describe('getProductsList', () => {
    it('should return list of product', async () => {
        await lambdaTester(getProductsList)
            .event({})
            .expectResult((result) => {
                expect(result.statusCode).toBe(200);
                const body = JSON.parse(result.body);
                expect(body).toEqual(productModel);
            });
    })
})
