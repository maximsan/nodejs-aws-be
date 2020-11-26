import { errorHandler } from '../../../shared/error';
import { productSchema } from '../utils/validation/product.validation.schema';
import { validate } from '../utils/validation/validate';
import { createResponse } from '../../../shared/createResponse';
import { StatusCodes } from 'http-status-codes';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { ProductService } from '../product.service';
import { ProductRepository } from '../product.repository';

const ProductRepo = new ProductRepository();
const ProductServ = new ProductService(ProductRepo);

export const createProduct = middy(async (event) => {
  const { body: product } = event;

  console.log(`event: ${JSON.stringify(event)}`);
  console.log(`body: ${JSON.stringify(product)}`);

  try {
    const deserializedProduct = JSON.parse(product);
    validate(productSchema, deserializedProduct);

    await ProductServ.create(deserializedProduct);

    return createResponse(StatusCodes.CREATED);
  } catch (error) {
    return errorHandler(error);
  }
}).use(cors());
