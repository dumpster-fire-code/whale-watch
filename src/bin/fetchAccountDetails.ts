import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

import { accountDetailsPath, addressesPath } from '~/constants/env';
import { Account } from '~/types';
import { readAndParse } from '~/utils/FileUtils';
import { logger } from '~/utils/Logger';
import { splitNameAndParenthetical, toNumber } from '~/utils/ParseUtils';
import { sleep } from '~/utils/PromiseUtils';

const usdValueThreshold = 1000;
const interRequestDelay = 500;

const addresses: string[] = readAndParse(addressesPath);

(async () => {
  const accounts: Record<string, Account> = {};

  for (const address of addresses) {
    logger.info(`Fetching account details for ${address}`);

    const res = await axios.get(`https://etherscan.io/address/${address}`);
    const $ = cheerio.load(res.data);

    const eth = toNumber(
      $(
        '#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div:nth-child(1) > div.col-md-8',
      ).text(),
    );

    const ethUsdValue = toNumber(
      splitNameAndParenthetical(
        $(
          '#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div:nth-child(3) > div.col-md-8',
        )
          .first()
          .text(),
      )[0],
    );

    const account: Account = {
      address,
      eth,
      ethUsdValue,
      tokens: {},
    };

    $('#availableBalanceClick li').each((_, el) => {
      const $li = $(el);

      if ($li.find('[title="Etherscan Token Reputation: SPAM"]').length > 0) {
        return;
      }

      const $name = $($li.find('.list-name'));

      if (!$name.length) {
        return;
      }

      let name: string;
      let symbol: string;

      if ($name.find('span').length === 2) {
        name = $name.find('span:first-of-type').attr('title')!;
        symbol = $name.find('span:last-of-type').attr('title')!;
      } else if ($name.find('span').length == 1) {
        if ($name.find('span').text().includes('(')) {
          [name] = splitNameAndParenthetical($name.text());
          symbol = $name.find('span').attr('title')!;
        } else {
          name = $name.find('span').attr('title')!;
          [, symbol] = splitNameAndParenthetical($name.text());
        }
      } else {
        [name, symbol] = splitNameAndParenthetical($name.text());
      }

      const amount = toNumber($li.find('.list-amount').text());
      const usdValue = toNumber($li.find('.list-usd-value').text());

      if (usdValue && usdValue >= usdValueThreshold) {
        account.tokens[symbol] = { name, symbol, amount, usdValue };
      }
    });

    accounts[account.address] = account;
    await sleep(interRequestDelay);
  }

  writeFileSync(accountDetailsPath, JSON.stringify(accounts, null, 2));
  logger.success(`Saved account details to ${accountDetailsPath}`);
})();
