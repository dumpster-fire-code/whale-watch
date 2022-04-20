# :whale2: Whale Watch

What are the whales up to?
## :package: Installing dependencies

After installing [Node](https://nodejs.org) and [Yarn](https://yarnpkg.com/), run `yarn install` from the project root.

## :eyes: Monitoring whale behavior 

1. Run `yarn fetchAddresses` to fetch the 1,000 non-smart-contract / non-exchange Ethereum addresses holding the most ETH.
2. Run `yarn fetchAccountDetails` to fetch the account details for the top ETH-holders, namely their token balances.
3. Run `yarn summarizeBalances` to aggregate the token balances for top ETH-holders.
4. Run `yarn saveSnapshot` to archive the current address, account details, and balance summaries, so they can be compared to future data.
5. Run `yarn compare` to compare the current data with the most recent archive.