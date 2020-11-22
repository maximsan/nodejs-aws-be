import lambdaTester from "lambda-tester";
import {catalogBatchProcess} from "./catalogBatchProcess";
import productBatchEvent from '../../__mocks__/productBatchEvent.json'
import {ProductService} from "../product.service";
import {SnsService} from "../sns.service";

describe('catalogBatchProcess', () => {
    let productServiceSpy;
    let snsServiceSpy;
    beforeEach(() => {
        productServiceSpy = jest.spyOn(ProductService.prototype, "create")
        snsServiceSpy = jest.spyOn(SnsService.prototype, 'send');
    })

    it('should return message \'Nothing to save\' if Records array is empty', async () => {
        await lambdaTester(catalogBatchProcess)
            .event({})
            .expectResult(result => {
                expect(result.statusCode).toBe(202);
                expect(result.body).toBe("Nothing to save");
            })
    });
    it('should return 201 if products are created', async () => {
        productServiceSpy.mockResolvedValue(null);
        snsServiceSpy.mockResolvedValue(null)

        await lambdaTester(catalogBatchProcess)
            .event(productBatchEvent)
            .expectResult(result => {
                console.log(result);
                expect(result.statusCode).toBe(201);
            })
    })
    it('should return 500 if error during product creation', async () => {
        productServiceSpy.mockReturnValue(Promise.reject(new Error("Error during product creation")));

        await lambdaTester(catalogBatchProcess)
            .event(productBatchEvent)
            .expectResult(result => {
                console.log(result);
                expect(result.statusCode).toBe(500);
                expect(result.body).toBe("Error during product creation")
            })
    });
    it('should return 500 if error during notification publishing', async () => {
        productServiceSpy.mockResolvedValue(null);
        snsServiceSpy.mockReturnValue(Promise.reject(new Error("Error during notification publishing")));

        await lambdaTester(catalogBatchProcess)
            .event(productBatchEvent)
            .expectResult(result => {
                console.log(result);
                expect(result.statusCode).toBe(500);
                expect(result.body).toBe("Error during notification publishing")
            })
    })
})
