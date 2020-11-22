import lambdaTester from 'lambda-tester';
import {getProductsList} from "./getProductsList";
import {ProductService} from "../product.service";
import {mockedProducts} from "../../__mocks__/products";

describe('getProductsList', () => {
    let serviceSpy
    beforeEach(() => {
        serviceSpy = jest.spyOn(ProductService.prototype, "getAll")
    })

    afterEach(() => {
        serviceSpy.mockClear();
    })

    it('should return list of product', async () => {
        serviceSpy.mockReturnValue(mockedProducts);

        const expectedResult = mockedProducts;

        await lambdaTester(getProductsList)
            .event({})
            .expectResult((result) => {
                expect(result.statusCode).toBe(200);
                expect(typeof result.body).toBe('string');
                expect(() => JSON.parse(result.body)).not.toThrow();
                expect(JSON.parse(result.body)).toEqual(expectedResult);
            });
    })
    it('should return status code 500 if something went wrong', async () => {
        serviceSpy.mockReturnValue(Promise.reject(new Error('Error!')));

        await lambdaTester(getProductsList)
            .event({})
            .expectResult((result) => {
                expect(result.statusCode).toBe(500);
                console.log(result.body);
                expect(typeof result.body).toBe('string');
            });
    });
})
