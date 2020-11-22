import lambdaTester from "lambda-tester";
import {getProductById} from "../../handler";
import {ProductService} from "../product.service";
import {mockedProduct, testId} from "../../__mocks__/product";

describe('getProductById', () => {
    let serviceSpy;
    beforeEach(() => {
        serviceSpy = jest.spyOn(ProductService.prototype, 'getById')
    })

    afterEach(() => {
        serviceSpy.mockClear();
    })

    it('should return 200 and product if id is correct', async () => {
        serviceSpy.mockReturnValue(mockedProduct);

        const expectedResult = mockedProduct;

        await lambdaTester(getProductById)
            .event({pathParameters: {id: testId}})
            .expectResult(result => {
                expect(result.statusCode).toBe(200);
                expect(() => JSON.parse(result.body)).not.toThrow();
                expect(JSON.parse(result.body)).toEqual(expectedResult);
            })
    })
    it('should return 404 if id is wrong', async () => {
        serviceSpy.mockReturnValue(null);

        await lambdaTester(getProductById)
            .event({pathParameters: {id: "7567ec4b-b10c-48c5-9345-fc73c48a1234"}})
            .expectResult(result => {
                console.log('result', result);
                expect(result.statusCode).toBe(404);
                expect(result.body).toBe('Product not found by id 7567ec4b-b10c-48c5-9345-fc73c48a1234');
            })
    })
    it('should return status code 500 if something went wrong', async () => {
        serviceSpy.mockReturnValue(Promise.reject(new Error('Error!')));

        await lambdaTester(getProductById)
            .event({pathParameters: {id: testId}})
            .expectResult(result => {
                expect(result.statusCode).toBe(500);
                expect(typeof result.body).toBe('string');
            })
    })
});
