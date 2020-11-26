import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import csv from 'csv-parser';
import { Token } from '../../DIContainer';
import { StatusCodes } from 'http-status-codes';
import { promisify } from 'util';
import { pipeline, Writable } from 'stream';
import { createResponse } from '../../../shared/createResponse';
import { errorHandler } from '../../../shared/error';

const promisifiedPipeline = promisify(pipeline);

export const importFileParserHandler = (container) => {
  const storageService = container.resolve(Token.storageService);
  const queueService = container.resolve(Token.queueService);
  const config = container.resolve(Token.config);

  return middy(async (event) => {
    if (!event?.Records?.length) {
      return createResponse(StatusCodes.NOT_FOUND, 'data is empty');
    }

    try {
      for (const record of event.Records) {
        console.log(`event record ${JSON.stringify(record)}`);

        const key = record.s3.object.key;

        const stream = storageService.readStream(key);
        const messages = [];

        const writableStream = new Writable({
          objectMode: true,
          async write(product, _, callback) {
            const strProduct = JSON.stringify(product);

            console.log(`record: ${strProduct}`);

            messages.push(queueService.sendMessage(config.QueueUrl, strProduct));

            callback();
          },
          async final(callback) {
            console.log(`Copy from ${config.Bucket}/${key}`);

            const newKey = key.replace('uploaded', 'parsed');

            await storageService.moveFromTo(key, newKey);

            console.log(`Copy to ${config.Bucket}/${newKey}`);

            await Promise.all(messages);

            callback(null);
          },
        });

        await promisifiedPipeline(stream, csv(), writableStream);
      }
    } catch (error) {
      return errorHandler(error);
    }
  }).use(inputOutputLogger());
};
