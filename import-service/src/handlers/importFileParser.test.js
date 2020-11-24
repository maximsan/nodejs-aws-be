import lambdaTester from 'lambda-tester';
import { importFileParser } from './importFileParser';
import { Readable } from 'stream';

describe('importFileParser', () => {
  it('should return status code 404 (NOT_FOUND) and data empty if data was not submitted', async () => {
    await lambdaTester(importFileParser)
      .event({})
      .expectResult((result) => {
        expect(result.statusCode).toBe(404);
        expect(result.body).toBe('data is empty');
      });
  });
  it('should parse file using csv stream and move from uploaded to parsed folder', async () => {
    const createReadStream = jest
      .fn()
      .mockReturnValue(
        Readable.from([
          'price,title,description,count\n',
          '1500,Guitar 1,Guitar 1 description,10\n',
          '2000,Guitar 2,Guitar 2 description,4\n',
          '3000,Guitar 3,Guitar 3 description,5\n',
        ])
      );

    // AWS.mock('S3', 'getObject', createReadStream);
    //
    // AWS.mock('S3', 'copyObject', (action) => {
    //   Promise.resolve();
    // });
    //
    // AWS.mock('S3', 'deleteObject', (action) => {
    //   Promise.resolve();
    // });

    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'nodejs-aws-be-upload',
            },
            object: {
              key: 'uploaded/products.csv',
            },
          },
        },
      ],
    };

    // Test will be added soon

    // await lambdaTester(importFileParser)
    //     .event(event)
    //     .expectResult((result) => {
    //         console.log(result);
    //     })
  });
});
