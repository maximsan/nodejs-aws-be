export class QueueService {
  constructor({ SQS }) {
    this.queue = SQS;
  }

  sendMessage(url, message) {
    const queueParams = {
      QueueUrl: url,
      MessageBody: message,
    };

    return this.queue.sendMessage(queueParams).promise();
  }
}
