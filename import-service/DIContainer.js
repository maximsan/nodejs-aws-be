import { asClass, asFunction, asValue, createContainer } from 'awilix';
import { S3, SQS } from 'aws-sdk';
import { BUCKET, CATALOG_ITEMS_QUEUE_URL } from './src/config';
import { QueueService } from './src/queue.service';
import { StorageService } from './src/storage.service';

const container = createContainer();

export const Token = {
  queueService: 'queueService',
  storageService: 'storageService',
  s3: 's3',
  SQS: 'SQS',
  config: 'config',
};

export const createS3 = () => new S3({ region: 'eu-west-1' });

export const createSQS = () => new SQS({ region: 'eu-west-1' });

export const createConfig = () => ({ Bucket: BUCKET, QueueUrl: CATALOG_ITEMS_QUEUE_URL });

const setup = () => {
  container.register({
    [Token.s3]: asFunction(createS3),
    [Token.SQS]: asFunction(createSQS),
    [Token.storageService]: asClass(StorageService).singleton(),
    [Token.queueService]: asClass(QueueService),
    [Token.config]: asValue({ Bucket: BUCKET, QueueUrl: CATALOG_ITEMS_QUEUE_URL }),
  });
};

export { container, setup };
