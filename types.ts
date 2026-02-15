
export interface MarketSummary {
  region: string;
  indexName: string;
  price: string;
  change: string;
  changePercent: string;
  status: 'up' | 'down' | 'neutral';
}

export interface ETFRecommendation {
  ticker: string;
  name: string;
  expenseRatio: string;
  ytdReturn: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface MarketInsight {
  summary: string;
  etfs: ETFRecommendation[];
  sources: { title: string; uri: string }[];
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  ANALYZER = 'analyzer',
  EDUCATION = 'education'
}
