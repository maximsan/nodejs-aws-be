import { config } from 'dotenv';
import { join } from 'path';

config({
  path: join(__dirname, '../.env'),
});

export const BUCKET = process.env.BUCKET;
export const CATALOG_ITEMS_QUEUE_URL = process.env.CATALOG_ITEMS_QUEUE_URL;
