import { asFunction, asValue, createContainer } from 'awilix';
import { S3 } from 'aws-sdk';
import lambdaTester from 'lambda-tester';
import { createS3, Token } from '../../DIContainer';
import { BUCKET } from '../config';
import { importProductsFileHandler } from './importProductsFile';

describe('importProductsFile', () => {
  let mockedContainer;
  beforeEach(() => {
    mockedContainer = createContainer()
      .register(Token.s3, asFunction(createS3))
      .register(Token.config, asValue({ Bucket: BUCKET }));
  });

  it('should return status 200 (OK) and signed url ' + 'if getSignedUrl was called for puObject event', async () => {
    const fileName = 'product.csv';
    const signedUrl = `https://somethingwassigned/${fileName}`;

    const importProductsFile = importProductsFileHandler(mockedContainer);

    jest.spyOn(S3.prototype, 'getSignedUrlPromise').mockResolvedValue(signedUrl);

    await lambdaTester(importProductsFile)
      .event({ queryStringParameters: { name: fileName } })
      .expectResult((result) => {
        console.log('result', result);
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(signedUrl);
      });
  });
  it(
    'should return status 400 (BAD_REQUEST) and message that name is required param ' + 'if name is missed',
    async () => {
      const importProductsFile = importProductsFileHandler(mockedContainer);

      await lambdaTester(importProductsFile)
        .event({})
        .expectResult((result) => {
          expect(result.statusCode).toBe(400);
          expect(result.body).toBe('name is required param');
        });
    },
  );
});
