import middy from '@middy/core';
import {createS3} from "./createS3";
import csv from 'csv-parser';
import {BUCKET} from "../config";
import {errorHandler} from "../../../shared/errorHandler";
import {createResponse} from "../../../shared/createResponse";
import {StatusCodes} from "http-status-codes";
import {promisify} from 'util'
import {pipeline, Writable} from 'stream'

const promisifiedPipeline = promisify(pipeline);

export const importFileParser = middy(async (event) => {
    const s3 = createS3();

    console.log(`event: ${JSON.stringify(event)}`);

    if (!(event && event.Records && event.Records.length)) {
        return createResponse(StatusCodes.NOT_FOUND, 'data is empty')
    }

    try {
        for (const record of event.Records) {
            console.log(`record: ${JSON.stringify(record)}`)
            const Key = record.s3.object.key;
            const bucketParams = {
                Bucket: BUCKET,
                Key,
            }

            console.log(`Key: ${Key}`)
            console.log(`BUCKET: ${BUCKET}`)

            const stream = s3.getObject(bucketParams).createReadStream()

            console.log(`stream: ${JSON.stringify(stream)}`)

            const writableStream = new Writable({
                objectMode: true,
                write(record, _, callback) {
                    console.log(`record: ${JSON.stringify(record)}`)
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

                    callback();
                }
            })

            console.log(`writableStream: ${JSON.stringify(writableStream)}`)

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
