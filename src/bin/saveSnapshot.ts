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
import { logger } from '~/utils/Logger';

const currentArchiveDir = join(archivesDir, Date.now().toString());

mkdirSync(currentArchiveDir);

const addressesSnapshotPath = join(currentArchiveDir, addressesFilename);
copyFileSync(addressesPath, addressesSnapshotPath, constants.COPYFILE_EXCL);
logger.success(`Saved addresses snapshot to ${addressesSnapshotPath}`);

const accountDetailsSnapshotPath = join(
  currentArchiveDir,
  accountDetailsFilename,
);
copyFileSync(
  accountDetailsPath,
  accountDetailsSnapshotPath,
  constants.COPYFILE_EXCL,
);
logger.success(
  `Saved account details snapshot to ${accountDetailsSnapshotPath}`,
);

const balanceSummariesSnapshotPath = join(
  currentArchiveDir,
  balanceSummariesFilename,
);
copyFileSync(
  balanceSummariesPath,
  balanceSummariesSnapshotPath,
  constants.COPYFILE_EXCL,
);
logger.success(
  `Saved balance summaries snapshot to ${balanceSummariesSnapshotPath}`,
);
