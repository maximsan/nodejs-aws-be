export class PolicyService {
  generatePolicy(principalId, isAuthorized, resource) {
    const effect = isAuthorized ? 'Allow' : 'Deny';
    console.log('effect', effect);

    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
    };
  }
}
