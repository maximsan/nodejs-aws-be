import {S3} from "aws-sdk";
import {BUCKET} from "./config";

const storageParams = {
    region: 'eu-west-1'
}

export class StorageService {
    constructor() {
        this.storage = new S3(storageParams);
    }

    get(key) {
        const bucketParams = {
            Bucket: BUCKET,
            Key: key,
        }

        return this.storage.getObject(bucketParams)
    }

    copy(from, to) {
        const bucketParams = {
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${from}`,
            Key: to
        }

        return this.storage.copyObject(bucketParams).promise()
    }

    delete(from) {
        const bucketParams = {
            Bucket: BUCKET,
            Key: from
        }

        return this.storage.deleteObject(bucketParams).promise()
    }

    async moveFromTo(from, to) {
        await this.copy(from, to);
        await this.delete(from);
    }
}
