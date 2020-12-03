import { asClass, asValue, createContainer } from 'awilix';
import { Token } from '../../DIContainer';
import lambdaTester from 'lambda-tester';
import { AuthorizerService } from '../authorizer.service';
import { EncoderService } from '../encoder.service';
import { PolicyService } from '../policy.service';
import { basicAuthorizerHandler } from './basicAuthorizer';

describe('basicAuthorizer', () => {
  let mockContainer;
  const user = 'maximsan';
  const password = 'TEST_PASSWORD';
  beforeEach(() => {
    mockContainer = createContainer()
      .register(Token.config, asValue({ [user]: password }))
      .register(Token.encoderService, asClass(EncoderService))
      .register(Token.authorizerService, asClass(AuthorizerService))
      .register(Token.policyService, asClass(PolicyService));
  });

  it('should return Allow policy if token is valid', async () => {
    const basicAuthorizer = basicAuthorizerHandler(mockContainer);

    await lambdaTester(basicAuthorizer)
      .event({
        type: 'TOKEN',
        authorizationToken: `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`,
        methodArn: 'arn',
      })
      .expectResult((result) => {
        console.log(result);
        expect(result).toHaveProperty('principalId', 'bWF4aW1zYW46VEVTVF9QQVNTV09SRA==');
        expect(result).toHaveProperty('policyDocument.Version', '2012-10-17');
        expect(result).toHaveProperty('policyDocument.Statement.0.Action', 'execute-api:Invoke');
        expect(result).toHaveProperty('policyDocument.Statement.0.Effect', 'Allow');
        expect(result).toHaveProperty('policyDocument.Statement.0.Resource', 'arn');
      });
  });

  it('should return Deny policy if token is invalid', async () => {
    const basicAuthorizer = basicAuthorizerHandler(mockContainer);
    const user = 'max';

    await lambdaTester(basicAuthorizer)
      .event({
        type: 'TOKEN',
        authorizationToken: `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`,
        methodArn: 'arn',
      })
      .expectResult((result) => {
        console.log(result);
        expect(result).toHaveProperty('principalId', 'bWF4OlRFU1RfUEFTU1dPUkQ=');
        expect(result).toHaveProperty('policyDocument.Version', '2012-10-17');
        expect(result).toHaveProperty('policyDocument.Statement.0.Action', 'execute-api:Invoke');
        expect(result).toHaveProperty('policyDocument.Statement.0.Effect', 'Deny');
        expect(result).toHaveProperty('policyDocument.Statement.0.Resource', 'arn');
      });
  });
});
