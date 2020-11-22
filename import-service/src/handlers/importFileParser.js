import middy from '@middy/core';
import {createS3} from "./createS3";
import csv from 'csv-parser';
import {BUCKET, CATALOG_ITEMS_QUEUE_URL} from "../config";
import {StatusCodes} from "http-status-codes";
import {promisify} from 'util'
import {pipeline, Writable} from 'stream'
import {createResponse} from "../../error/createResponse";
import {errorHandler} from "../../error/errorHandler";
import {SQS} from 'aws-sdk'

const promisifiedPipeline = promisify(pipeline);

export const importFileParser = middy(async (event) => {
    const s3 = createS3();
    const sqs = new SQS();

    if (!(event && event.Records && event.Records.length)) {
        return createResponse(StatusCodes.NOT_FOUND, 'data is empty')
    }

    try {
        for (const record of event.Records) {
            const Key = record.s3.object.key;
            const bucketParams = {
                Bucket: BUCKET,
                Key,
            }

            console.log(`event record ${JSON.stringify(record)}`);

            const stream = s3.getObject(bucketParams).createReadStream()

            const writableStream = new Writable({
                objectMode: true,
                async write(product, _, callback) {
                    console.log(`record: ${JSON.stringify(product)}`)

                    const strProduct = JSON.stringify(product);
                    const sqsParams = {
                        QueueUrl: CATALOG_ITEMS_QUEUE_URL,
                        MessageBody: strProduct
                    }

                    await sqs.sendMessage(sqsParams).promise();

                    callback();
                },
                async final(callback) {
                    console.log(`Copy from ${BUCKET}/${Key}`)
                    const newKey = Key.replace('uploaded', 'parsed');

                    await s3.copyObject({
                        ...bucketParams,
                        CopySource: `${BUCKET}/${Key}`,
                        Key: newKey
                    }).promise()

                    await s3.deleteObject({
                        Bucket: BUCKET,
                        Key
                    }).promise()

                    console.log(`Copy to ${BUCKET}/${newKey}`);

                    callback(null);
                }
            })

            await promisifiedPipeline(
                stream,
                csv(),
                writableStream
            )
        }
    } catch (error) {
        return errorHandler(error)
    }
})
