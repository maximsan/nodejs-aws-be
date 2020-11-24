import { SQS } from 'aws-sdk';
import { CATALOG_ITEMS_QUEUE_URL } from './config';

export class QueueService {
  constructor() {
    this.queue = new SQS();
  }

  sendMessage(message) {
    const queueParams = {
      QueueUrl: CATALOG_ITEMS_QUEUE_URL,
      MessageBody: message,
    };

    return this.queue.sendMessage(queueParams).promise();
  }
}
