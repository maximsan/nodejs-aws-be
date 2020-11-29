import { setup, container } from '../../DIContainer';

import { basicAuthorizerHandler } from './basicAuthorizer';

setup();

export const basicAuthorizer = basicAuthorizerHandler(container);
