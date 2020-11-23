import AWS from 'aws-sdk-mock';
import lambdaTester from "lambda-tester";
import {importProductsFile} from "./importProductsFile";
import {StorageService} from "../storage.service";

describe('importProductsFile', () => {
    let spyService;
    beforeEach(() => {
        spyService = jest.spyOn(StorageService.prototype, 'getUrl')
    })

    afterEach(() => {
        spyService.mockClear();
    })

    it('should return status 200 (OK) and signed url ' +
        'if getSignedUrl was called for puObject event', async () => {
        const fileName = 'product.csv'
        const signedUrl = `https://somethingwassigned/${fileName}`;
        spyService.mockReturnValue(signedUrl)

        await lambdaTester(importProductsFile)
            .event({queryStringParameters: {name: fileName}})
            .expectResult(result => {
                expect(result.statusCode).toBe(200);
                expect(result.body).toBe(signedUrl);
            })
    });
    it('should return status 400 (BAD_REQUEST) and message that name is required param ' +
        'if name is missed', async () => {
        await lambdaTester(importProductsFile)
            .event({})
            .expectResult(result => {
                expect(result.statusCode).toBe(400);
                expect(result.body).toBe('name is required param');
            })
    });
})
