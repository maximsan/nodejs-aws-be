import { BUCKET } from './config';

export class StorageService {
  constructor({ s3 }) {
    this.storage = s3;
  }

  get(key) {
    const bucketParams = {
      Bucket: BUCKET,
      Key: key,
    };

    return this.storage.getObject(bucketParams);
  }

  readStream(key) {
    return this.get(key).createReadStream();
  }

  copy(from, to) {
    const bucketParams = {
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${from}`,
      Key: to,
    };

    return this.storage.copyObject(bucketParams).promise();
  }

  delete(from) {
    const bucketParams = {
      Bucket: BUCKET,
      Key: from,
    };

    return this.storage.deleteObject(bucketParams).promise();
  }

  async moveFromTo(from, to) {
    await this.copy(from, to);
    await this.delete(from);
  }
}
