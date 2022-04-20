import { readFileSync, writeFileSync } from 'fs';
import { logger } from 'utils/Logger';

import { accountDetailsPath, balanceSummariesPath } from '~/constants/env';
import { Account, BalanceSummary } from '~/types';

const accounts: Account[] = JSON.parse(
  readFileSync(accountDetailsPath, 'utf8'),
);

const summaries: Record<string, BalanceSummary | undefined> = {};

accounts.forEach(({ tokens }) => {
  tokens.forEach(({ name, symbol, amount, usdValue }) => {
    if (summaries[symbol] === undefined) {
      summaries[symbol] = {
        name,
        symbol,
        amount: 0,
        numHolders: 0,
        usdValue: 0,
      };
    }

    const summary = summaries[symbol];
    summary.amount += amount;
    summary.usdValue += usdValue;
    summary.numHolders++;
  });
});

const sortedSummaries = Object.values(summaries).sort(
  (a, b) => b.usdValue - a.usdValue,
);

sortedSummaries.forEach((summary) => {
  logger.log(
    [
      `### ${summary.name} (${summary.symbol})`,
      `- **Holders:** ${summary.numHolders}`,
      `- **Amount:** ${summary.amount.toLocaleString()}`,
      `- **USD value:** ${summary.usdValue.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
      })}`,
    ].join('\n') + '\n',
  );
});

writeFileSync(balanceSummariesPath, JSON.stringify(sortedSummaries, null, 2));
