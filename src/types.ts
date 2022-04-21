export interface Account {
  address: string;
  eth: number;
  ethUsdValue: number;
  tokens: Record<string, Token>;
}

export interface Token {
  amount: number;
  name: string;
  symbol: string;
  usdValue: number;
}

export interface BalanceSummary {
  amount: number;
  name: string;
  numHolders: number;
  symbol: string;
  usdValue: number;
}

export interface TokenAmountChange {
  symbol: string;
  archivedAmount: number;
  amount: number;
  amountChange: number;
  amountChangePct: number;
  archivedUsdValue: number;
  usdValue: number;
  usdValueChange: number;
}

export interface AddressTokenAmountChange extends TokenAmountChange {
  address: string;
}
