### Implemented features:

1. getProductsList lambda - [link](https://0nw7hvxew9.execute-api.eu-west-1.amazonaws.com/dev/products)
2. getProductsById lambda - [link](https://0nw7hvxew9.execute-api.eu-west-1.amazonaws.com/dev/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa)
3. createProduct lambda - [link](https://0nw7hvxew9.execute-api.eu-west-1.amazonaws.com/dev/products)
4. FE repository - [link](https://github.com/maximsan/nodejs-aws-fe)
5. FE integrated with BE - [link](https://dg2e8nno6k0ty.cloudfront.net/)
6. Swagger API - [link](https://app.swaggerhub.com/apis-docs/maximsan/node-aws-be/1.0.0)

### Scripts

#### local lambda testing

```sh
    yarn local
```

#### deploy full service

```sh
    yarn deploy
```

#### deploy only lambda

```sh
    yarn deploy:f <function-name>
```

#### run all test

```sh
    yarn test
```
