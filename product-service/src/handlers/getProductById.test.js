import lambdaTester from "lambda-tester";
import {getProductById} from "../../handler";

describe('getProductById', () => {
    it('should return 200 & product by id if id correct', async () => {
        const expected = {
            "count": 4,
            "description": "Short Product Description1",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            "price": 2.4,
            "title": "Guitar 1"
        }

        await lambdaTester(getProductById)
            .event({pathParameters: {id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa"}})
            .expectResult(result => {
                expect(result.statusCode).toBe(200);
                const body = JSON.parse(result.body);
                expect(body).toEqual(expected);
            })
    })
    it('should return 404 if id wrong', async () => {
        await lambdaTester(getProductById)
            .event({pathParameters: {id: "7567ec4b-b10c-48c5-9345-fc73c48a1234"}})
            .expectResult(result => {
                expect(result.statusCode).toBe(404);
                expect(result.message).toBe('Product not found');
            })
    })
});
