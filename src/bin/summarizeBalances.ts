import { writeFileSync } from 'fs';
import { logger } from 'utils/Logger';

import { accountDetailsPath, balanceSummariesPath } from '~/constants/env';
import { Account, BalanceSummary } from '~/types';
import { readAndParse } from '~/utils/FileUtils';

const accounts: Record<string, Account> = readAndParse(accountDetailsPath);

const summaries: Record<string, BalanceSummary | undefined> = {};

Object.values(accounts).forEach(({ tokens }) => {
  Object.values(tokens).forEach(({ name, symbol, amount, usdValue }) => {
    if (summaries[symbol] === undefined) {
      summaries[symbol] = {
        name,
        symbol,
        amount: 0,
        numHolders: 0,
        usdValue: 0,
      };
    }

    const summary = summaries[symbol]!;
    summary.amount += amount;
    summary.usdValue += usdValue;
    summary.numHolders++;
  });
});

writeFileSync(balanceSummariesPath, JSON.stringify(summaries, null, 2));
logger.success(`Saved balance summaries to ${balanceSummariesPath}`);
