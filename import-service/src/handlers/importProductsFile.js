import { StatusCodes } from 'http-status-codes';
import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import cors from '@middy/http-cors';
import { createResponse } from '../../../shared/createResponse';
import { errorHandler } from '../../../shared/error';
import { Token } from '../../DIContainer';

export const importProductsFileHandler = (container) => {
  const s3 = container.resolve(Token.s3);
  const config = container.resolve(Token.config);

  return middy(async (event) => {
    const fileName = event?.queryStringParameters?.name;
    if (!fileName) {
      return createResponse(StatusCodes.BAD_REQUEST, 'name is required param');
    }

    try {
      const filePath = `uploaded/${fileName}`;
      const bucketParams = {
        Bucket: config.Bucket,
        Key: filePath,
        ContentType: 'text/csv',
      };
      const signedUrl = await s3.getSignedUrlPromise('putObject', bucketParams);

      console.log(`signedUrl: ${signedUrl}`);
      return createResponse(StatusCodes.OK, signedUrl);
    } catch (error) {
      return errorHandler(error);
    }
  })
    .use(cors())
    .use(inputOutputLogger());
};
