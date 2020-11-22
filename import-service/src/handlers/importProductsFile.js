import {StatusCodes} from "http-status-codes";
import middy from '@middy/core';
import cors from "@middy/http-cors";
import {createS3} from "./createS3";
import {BUCKET} from "../config";
import {createResponse} from "../../../shared/createResponse";
import {errorHandler} from "../../../shared/error";

export const importProductsFile = middy(async (event) => {
    console.log(`queryStringParameters: ${JSON.stringify(event.queryStringParameters)}`);

    const fileName = event && event.queryStringParameters && event.queryStringParameters.name;
    if (!fileName) {
        return createResponse(StatusCodes.BAD_REQUEST, 'name is required param')
    }

    const filePath = `uploaded/${fileName}`;

    const bucketParams = {
        Bucket: BUCKET,
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
