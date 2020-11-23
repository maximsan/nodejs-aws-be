import {StatusCodes} from "http-status-codes";
import middy from '@middy/core';

const inputOutputLogger = require('@middy/input-output-logger')
import cors from "@middy/http-cors";
import {BUCKET} from "../config";
import {createResponse} from "../../../shared/createResponse";
import {errorHandler} from "../../../shared/error";
import {StorageService} from "../storage.service";

const StorageServ = new StorageService();

export const importProductsFile = middy(async (event) => {
    const fileName = event && event.queryStringParameters && event.queryStringParameters.name;
    if (!fileName) {
        return createResponse(StatusCodes.BAD_REQUEST, 'name is required param')
    }

    try {
        const filePath = `uploaded/${fileName}`;
        const signedUrl = await StorageServ.getUrl(filePath) ;

        console.log(`signedUrl: ${signedUrl}`);
        return createResponse(StatusCodes.OK, signedUrl);
    } catch (error) {
        return errorHandler(error)
    }
}).use(cors())
    .use(inputOutputLogger())
