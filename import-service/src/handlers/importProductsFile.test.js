import AWS from 'aws-sdk-mock';
import {S3} from "aws-sdk";

describe('importProductsFile', () => {
    it('should return signed url if getSignedUrl was called for puObject event', async () => {
        AWS.mock("S3", "getSignedUrl", (action, _params, cb) => {
            cb(null, 'aws.com');
        })
        const s3 = new S3();
        const url = await s3.getSignedUrlPromise('putObject', {Key: 'key', Bucket: 'Bucket'})

        expect(url).toBe('aws.com');
    });
})
