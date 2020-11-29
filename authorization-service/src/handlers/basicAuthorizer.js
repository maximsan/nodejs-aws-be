/* eslint-disable node/no-callback-literal */

import { Token } from '../../DIContainer';

export const basicAuthorizerHandler = (container) => {
  const encoderService = container.resolve(Token.encoderService);
  const authorizerService = container.resolve(Token.authorizerService);
  const policyService = container.resolve(Token.policyService);

  return (event, ctx, cb) => {
    console.log('event', event);

    if (event.type !== 'TOKEN') {
      console.log('event.type', event.type);

      throw new Error('Unauthorized');
    }

    try {
      console.log('token', event.authorizationToken);

      const [basic, personalDataEncoded] = event.authorizationToken.split(' ');

      if (basic.indexOf('Basic') === -1) {
        throw new Error('Error: Invalid token');
      }

      console.log('personalDataEncoded', personalDataEncoded);

      const [login, password] = encoderService.decode(personalDataEncoded).split(':');

      const isAuthorized = authorizerService.isAuthorized(login, password);

      const policy = policyService.generatePolicy(personalDataEncoded, isAuthorized, event.methodArn);

      console.log('policy', policy);

      cb(null, policy);
    } catch (error) {
      console.log(`error ${error.error}`);
      throw new Error('Unauthorized');
    }
  };
};
