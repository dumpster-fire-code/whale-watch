import chalk from 'chalk';
import { readdirSync } from 'fs';
import { join } from 'path';

import {
  archivesDir,
  balanceSummariesFilename,
  balanceSummariesPath,
} from '~/constants/env';
import {
  Account,
  AddressTokenAmountChange,
  BalanceSummary,
  TokenAmountChange,
} from '~/types';
import { assertExists, readAndParse } from '~/utils/FileUtils';
import { logger } from '~/utils/Logger';

import { accountDetailsFilename, accountDetailsPath } from '../constants/env';

const addressUsdValueChangeThreshold = 250000;
const aggregatedUsdValueChangeThreshold = 250000;

const latestArchiveDirectory = readdirSync(archivesDir, {
  withFileTypes: true,
})
  .filter((fileOrFolder) => fileOrFolder.isDirectory())
  .sort((a, b) => b.name.localeCompare(a.name))[0];

if (!latestArchiveDirectory) {
  logger.error(`No archives found in ${archivesDir}`);
  process.exit(1);
}

const archivedAccountDetailsPath = join(
  archivesDir,
  latestArchiveDirectory.name,
  accountDetailsFilename,
);

const archivedBalanceSummariesPath = join(
  archivesDir,
  latestArchiveDirectory.name,
  balanceSummariesFilename,
);

assertExists(
  archivedAccountDetailsPath,
  `No archived account details found at ${archivedAccountDetailsPath}`,
);

assertExists(
  accountDetailsPath,
  `No account details found at ${accountDetailsPath}`,
);

assertExists(
  archivedBalanceSummariesPath,
  `No archived balance summaries found at ${archivedBalanceSummariesPath}`,
);

assertExists(
  balanceSummariesPath,
  `No balance summaries found at ${balanceSummariesPath}`,
);

const allArchivedAccountDetails: Record<string, Account> = readAndParse(
  archivedAccountDetailsPath,
);

const allAccountDetails: Record<string, Account> =
  readAndParse(accountDetailsPath);

const allArchivedBalanceSummaries: Record<string, BalanceSummary> =
  readAndParse(archivedBalanceSummariesPath);

const allBalanceSummaries: Record<string, BalanceSummary> =
  readAndParse(balanceSummariesPath);

const addressTokenAmountChanges: AddressTokenAmountChange[] = [];
const aggregateTokenAmountChanges: TokenAmountChange[] = [];

Object.values(allAccountDetails).forEach((details) => {
  const archivedDetails = allArchivedAccountDetails[details.address];

  if (!archivedDetails) {
    return;
  }

  Object.values(details.tokens).forEach((token) => {
    const archivedToken = archivedDetails.tokens[token.symbol];

    if (!archivedToken) {
      return;
    }

    const amountChange = token.amount - archivedToken.amount;
    const usdValueChange = token.usdValue - archivedToken.usdValue;

    if (Math.abs(usdValueChange) > addressUsdValueChangeThreshold) {
      addressTokenAmountChanges.push({
        address: details.address,
        symbol: token.symbol,
        archivedAmount: archivedToken.amount,
        amount: token.amount,
        amountChange,
        amountChangePct: amountChange / token.amount,
        archivedUsdValue: archivedToken.usdValue,
        usdValue: token.usdValue,
        usdValueChange,
      });
    }
  });
});

Object.values(allBalanceSummaries).forEach((token) => {
  const archivedToken = allArchivedBalanceSummaries[token.symbol];

  if (!archivedToken) {
    return;
  }

  const amountChange = token.amount - archivedToken.amount;
  const usdValueChange = token.usdValue - archivedToken.usdValue;

  if (Math.abs(usdValueChange) > aggregatedUsdValueChangeThreshold) {
    aggregateTokenAmountChanges.push({
      symbol: token.symbol,
      archivedAmount: archivedToken.amount,
      amount: token.amount,
      amountChange,
      amountChangePct: amountChange / token.amount,
      archivedUsdValue: archivedToken.usdValue,
      usdValue: token.usdValue,
      usdValueChange,
    });
  }
});

addressTokenAmountChanges.sort((a, b) => b.usdValueChange - a.usdValueChange);
aggregateTokenAmountChanges.sort((a, b) => b.usdValueChange - a.usdValueChange);

const formatChangePct = (changePct: number) =>
  changePct.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
    style: 'percent',
  });

const formatAmountChange = (amountChange: number) =>
  amountChange.toLocaleString('en-US', {
    signDisplay: 'exceptZero',
  });

const formatUsdValueChange = (usdValueChange: number) =>
  usdValueChange.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    signDisplay: 'exceptZero',
    style: 'currency',
  });

console.table(
  addressTokenAmountChanges.map(
    ({ address, amountChange, amountChangePct, usdValueChange, symbol }) => ({
      address,
      symbol,
      usdValueChange: formatUsdValueChange(usdValueChange),
      amountChange: formatAmountChange(amountChange),
      changePct: formatChangePct(amountChangePct),
    }),
  ),
  ['address', 'symbol', 'changePct', 'amountChange', 'usdValueChange'],
);

console.table(
  aggregateTokenAmountChanges.map(
    ({ amountChange, amountChangePct, usdValueChange, symbol }) => ({
      symbol,
      usdValueChange: formatUsdValueChange(usdValueChange),
      amountChange: formatAmountChange(amountChange),
      changePct: formatChangePct(amountChangePct),
    }),
  ),
  ['symbol', 'usdValueChange', 'amountChange', 'changePct'],
);
