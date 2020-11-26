import { errorHandler } from '../../../shared/error';
import { createResponse } from '../../../shared/createResponse';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from '../product.service';
import { ProductRepository } from '../product.repository';

const ProductRepo = new ProductRepository();
const ProductServ = new ProductService(ProductRepo);

export const getProductsList = middy(async (event) => {
  console.log(`event: ${JSON.stringify(event)}`);

  try {
    const products = await ProductServ.getAll();
    return createResponse(StatusCodes.OK, products);
  } catch (error) {
    return errorHandler(error);
  }
}).use(cors());
