import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

import { dataDir } from '~/constants/env';
import { logger } from '~/utils/Logger';
import { sleep } from '~/utils/PromiseUtils';

const addressQuota = 2000;
const interRequestDelay = 500;

const addresses: string[] = [];

const fetchAddresses = async (page: number = 1) => {
  logger.info(`Fetching page ${page} of top ethereum-holding addresses`);

  try {
    const res = await axios.get(`https://etherscan.io/accounts/${page}`);
    const $ = cheerio.load(res.data);

    $('table tbody tr').each((_, el) => {
      const $row = $(el);

      const isContract = $row.find('[title=Contract]').length > 0;
      const hasNameTag = $row.find('td:nth-child(3)').text().trim().length > 0;

      if (!isContract && !hasNameTag) {
        addresses.push(
          $row.find('td:nth-child(2)').text().trim().toLowerCase(),
        );
      }
    });

    if (addresses.length < addressQuota) {
      await sleep(interRequestDelay);
      fetchAddresses(page + 1);
    } else {
      writeFileSync(
        `${dataDir}/addresses.json`,
        JSON.stringify(addresses, null, 2),
      );
    }
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

fetchAddresses();
