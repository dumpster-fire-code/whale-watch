export type Account = {
  address: string;
  eth: number;
  ethUsdValue: number;
  tokens: Token[];
};

export type Token = {
  amount: number;
  name: string;
  symbol: string;
  usdValue: number;
};

export type BalanceSummary = {
  amount: number;
  name: string;
  numHolders: number;
  symbol: string;
  usdValue: number;
};
