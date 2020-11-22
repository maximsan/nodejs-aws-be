import {SQS} from 'aws-sdk'
import middy from "@middy/core";
import cors from "@middy/http-cors";
import {SQS_URL} from "../config";
import {errorHandler} from "../../error/errorHandler";
import {createResponse} from "../../error/createResponse";
import {StatusCodes} from "http-status-codes";
import {runDB} from "../utils/db";

export const catalogBatchProcess = middy(async (event) => {
    const {body: products} = event

    const sqs = new SQS();
    const deserializedProducts = JSON.parse(products);

    const db = await runDB();

    for (const product of deserializedProducts) {
        const sqsParams = {
            QueueUrl: SQS_URL,
            MessageBody: product
        }

        try {
            await sqs.sendMessage(sqsParams).promise();
        } catch (error) {
            return errorHandler(error);
        }
    }

    return createResponse(StatusCodes.CREATED);

}).use(cors())
