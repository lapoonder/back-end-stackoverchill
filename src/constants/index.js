import path from 'node:path';

export const TWO_DAY = 2 * 24 * 60 * 60 * 1000;
export const THIRTY_DAY = 30 * 24 * 60 * 60 * 1000;

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
