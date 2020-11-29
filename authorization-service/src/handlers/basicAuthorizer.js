import { createResponse } from '../../../shared/createResponse';
import { StatusCodes } from 'http-status-codes';
import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';

export const basicAuthorizerHandler = (container) => {
  return middy((event, ctx, cb) => {
    const { headers } = event;

    const authorization = headers.Authorization;

    if (!authorization) {
      // cb('Unauthorized');
      return createResponse(StatusCodes.UNAUTHORIZED);
    }

    if (event.type !== 'TOKEN') {
      return createResponse(StatusCodes.UNAUTHORIZED);
    }

    try {
      const token = event.authorizationToken;

      if (token.indexOf('Basic') === -1) {
        console.log('invalid token', token);
        return createResponse(StatusCodes.FORBIDDEN);
      }

      const tokenPartEncoded = token.split(' ')[1];
      const buff = Buffer.from(tokenPartEncoded, 'base-64');
      const personalData = buff.toString('utf-8').split(':');
      const login = personalData[0];
      const password = personalData[1];

      const storedPassword = process.env[login];

      const action = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';

      const policy = {
        principalId: tokenPartEncoded,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: action,
              Resource: event.methodArn,
            },
          ],
        },
      };

      cb(null, policy);
    } catch (error) {
      cb(`Unauthorized: ${error.message}`);
    }
  }).use(inputOutputLogger());
};
