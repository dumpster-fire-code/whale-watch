import dotenv from 'dotenv';
import { join, normalize } from 'path';

dotenv.config();

export const dataDir = normalize(join(__dirname, '..', '..', 'data'));
export const archivesDir = join(dataDir, 'archives');

export const addressesFilename = 'addresses.json';
export const accountDetailsFilename = 'accountDetails.json';
export const balanceSummariesFilename = 'balanceSummaries.json';

export const addressesPath = join(dataDir, addressesFilename);
export const accountDetailsPath = join(dataDir, accountDetailsFilename);
export const balanceSummariesPath = join(dataDir, balanceSummariesFilename);

export const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
