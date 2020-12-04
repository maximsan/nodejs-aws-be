import { asClass, asValue, createContainer } from 'awilix';
import { AuthorizerService } from './src/authorizer.service';
import { EncoderService } from './src/encoder.service';
import { PolicyService } from './src/policy.service';

const container = createContainer();

export const Token = {
  config: 'config',
  encoderService: 'encoderService',
  authorizerService: 'authorizerService',
  policyService: 'policyService',
};

const setup = () => {
  container.register({
    [Token.config]: asValue({ ...process.env }),
    [Token.encoderService]: asClass(EncoderService),
    [Token.authorizerService]: asClass(AuthorizerService),
    [Token.policyService]: asClass(PolicyService),
  });
};

export { setup, container };
