import {S3} from 'aws-sdk'
import {createResponse} from "../../../shared/createResponse";
import {errorHandler} from "../../../shared/errorHandler";
import {StatusCodes} from "http-status-codes";
import middy from '@middy/core';
import cors from "@middy/http-cors";

const s3params = {
    region: 'eu-west-1'
}
const bucket = 'nodejs-aws-be-upload'

const createS3 = () => {
    return new S3(s3params);
}

export const importProductsFile = middy(async (event) => {
    console.log(`queryStringParameters: ${JSON.stringify(event.queryStringParameters)}`);

    const fileName = event && event.queryStringParameters && event.queryStringParameters.name;
    if (!fileName) {
        return createResponse(StatusCodes.BAD_REQUEST, 'name is required param')
    }

    const filePath = `uploaded/${fileName}`;

    const bucketParams = {
        Bucket: bucket,
        Key: filePath,
        ContentType: 'text/csv'
    }

    try {
        const signedUrl = await createS3().getSignedUrlPromise('putObject', bucketParams);

        console.log(`signedUrl: ${signedUrl}`);
        return createResponse(StatusCodes.OK, signedUrl);
    } catch (error) {
        return errorHandler(error)
    }
}).use(cors())
