import { setup, container } from '../../DIContainer';
import { importFileParserHandler } from './importFileParser';
import { importProductsFileHandler } from './importProductsFile';

setup();

export const importFileParser = importFileParserHandler(container);
export const importProductsFile = importProductsFileHandler(container);
