import { constants, copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

import {
  balanceSummariesFilename,
  balanceSummariesPath,
} from '~/constants/env';
import {
  accountDetailsFilename,
  accountDetailsPath,
  addressesFilename,
  addressesPath,
  archivesDir,
} from '~/constants/env';

const currentArchiveDir = join(archivesDir, Date.now().toString());

mkdirSync(currentArchiveDir);

copyFileSync(
  addressesPath,
  join(currentArchiveDir, addressesFilename),
  constants.COPYFILE_EXCL,
);

copyFileSync(
  accountDetailsPath,
  join(currentArchiveDir, accountDetailsFilename),
  constants.COPYFILE_EXCL,
);

copyFileSync(
  balanceSummariesPath,
  join(currentArchiveDir, balanceSummariesFilename),
  constants.COPYFILE_EXCL,
);
