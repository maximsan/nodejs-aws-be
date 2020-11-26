import { asClass, asFunction, asValue, createContainer } from 'awilix';
import lambdaTester from 'lambda-tester';
import { createConfig, createS3, createSQS, Token } from '../../DIContainer';
import { QueueService } from '../queue.service';
import { StorageService } from '../storage.service';
import { importFileParserHandler } from './importFileParser';

describe('importFileParser', () => {
  let mockedContainer;
  beforeEach(() => {
    mockedContainer = createContainer()
      .register(Token.s3, asFunction(createS3))
      .register(Token.SQS, asFunction(createSQS))
      .register(Token.storageService, asClass(StorageService))
      .register(Token.queueService, asClass(QueueService))
      .register(Token.config, asValue(createConfig()));
  });

  it('should return status code 404 (NOT_FOUND) and data empty if data was not submitted', async () => {
    const importFileParser = importFileParserHandler(mockedContainer);

    await lambdaTester(importFileParser)
      .event({})
      .expectResult((result) => {
        expect(result.statusCode).toBe(404);
        expect(result.body).toBe('data is empty');
      });
  });
  xit('should parse file using csv stream and move from uploaded to parsed folder', async () => {
    // mockedContainer.register(Token.config, asValue({ Bucket: 'nodejs-aws-be-upload', QueueUrl: 'QueueUrl' }));
    //
    // const readStream = jest
    //   .spyOn(StorageService.prototype, 'readStream')
    //   .mockReturnValue(
    //     Readable.from([
    //       'price,title,description,count\n',
    //       '1500,Guitar 1,Guitar 1 description,10\n',
    //       '2000,Guitar 2,Guitar 2 description,4\n',
    //       '3000,Guitar 3,Guitar 3 description,5\n',
    //     ])
    //   );
    //
    // const moveFromTo = jest.spyOn(StorageService.prototype, 'moveFromTo').mockReturnValue(null);
    //
    // const event = {
    //   Records: [
    //     {
    //       s3: {
    //         bucket: {
    //           name: 'nodejs-aws-be-upload',
    //         },
    //         object: {
    //           key: 'uploaded/products.csv',
    //         },
    //       },
    //     },
    //   ],
    // };
    //
    // const importFileParser = importFileParserHandler(mockedContainer);
    //
    // await lambdaTester(importFileParser)
    //   .event(event)
    //   .expectResult((result) => {
    //     console.log(result);
    //
    //     expect(readStream).toHaveBeenCalled(1);
    //     expect(moveFromTo).toHaveBeenCalled(1);
    //   });
  });
});
