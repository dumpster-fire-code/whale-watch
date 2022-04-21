import { existsSync, readFileSync } from 'fs';

import { logger } from '~/utils/Logger';

const assertExists = (path: string, error: string) => {
  if (!existsSync(path)) {
    logger.error(error);
    process.exit(1);
  }
};

const readAndParse = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

export { assertExists, readAndParse };
