import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import csv from 'csv-parser';
import { BUCKET } from '../config';
import { StatusCodes } from 'http-status-codes';
import { promisify } from 'util';
import { pipeline, Writable } from 'stream';
import { createResponse } from '../../../shared/createResponse';
import { errorHandler } from '../../../shared/error';
import { StorageService } from '../storage.service';
import { QueueService } from '../queue.service';

const promisifiedPipeline = promisify(pipeline);
const StorageServ = new StorageService();
const QueueServ = new QueueService();

export const importFileParser = middy(async (event) => {
  if (!event?.Records?.length) {
    return createResponse(StatusCodes.NOT_FOUND, 'data is empty');
  }

  try {
    for (const record of event.Records) {
      console.log(`event record ${JSON.stringify(record)}`);

      const key = record.s3.object.key;
      const stream = StorageServ.get(key).createReadStream();
      const messages = [];

      const writableStream = new Writable({
        objectMode: true,
        async write(product, _, callback) {
          const strProduct = JSON.stringify(product);

          console.log(`record: ${strProduct}`);

          messages.push(QueueServ.sendMessage(strProduct));

          callback();
        },
        async final(callback) {
          console.log(`Copy from ${BUCKET}/${key}`);

          const newKey = key.replace('uploaded', 'parsed');

          await StorageServ.moveFromTo(key, newKey);

          console.log(`Copy to ${BUCKET}/${newKey}`);

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
