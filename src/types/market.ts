export type AssetClassType =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export interface MarketTicker {
  symbol: string;
  name: string;
  assetClass: AssetClassType;
  sector?: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  dividendYield?: number;
  sparkline: number[];
  currency: string;
  isFavorite?: boolean;
  marketStatus?: 'Open' | 'Closed' | 'Pre-Market' | 'After-Hours';
  beta?: number;
  eps?: number;
  high52w?: number;
  low52w?: number;
  avgVolume?: string;
  analystRating?: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
  targetPrice?: number;
}

export interface BenchmarkIndex {
  id: string;
  name: string;
  symbol: string;
  badgeNumber: string;
  badgeColor: string; // e.g. '#D83A56', '#089981', '#0088CC'
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  high: number;
  low: number;
}

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookRow {
  price: number;
  size: number;
  total: number;
  percent: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  triggered?: boolean;
}

export interface PaperTrade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  timestamp: string;
}
