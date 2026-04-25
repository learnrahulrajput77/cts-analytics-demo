export type Channel =
  | 'Modern Trade'
  | 'General Trade'
  | 'E-Commerce'
  | 'Direct-to-Consumer';

export type AISegment =
  | 'Profitable Stars'
  | 'High CTS Risk'
  | 'Niche Efficient'
  | 'Growth Opportunity';

export interface Customer {
  customer_id: string;
  customer_name: string;
  channel: Channel;

  annual_revenue: number;

  freight_cost: number;
  warehouse_cost: number;
  order_processing_cost: number;
  promo_cost: number;
  returns_cost: number;
  total_cts: number;

  avg_order_size: number;
  order_frequency_per_year: number;
  distance_km: number;
  return_rate_pct: number;

  cts_pct: number;
  net_margin_pct: number;
  order_volume: number;

  ai_segment: AISegment;
}

export interface SimulatorState {
  order_frequency: number;
  avg_order_size: number;
  route_efficiency: number;
  promo_multiplier: number;
  return_rate: number;
}

export interface CostBreakdown {
  freight_cost: number;
  warehouse_cost: number;
  order_processing_cost: number;
  promo_cost: number;
  returns_cost: number;
  total_cts: number;
  cts_pct: number;
  net_margin_pct: number;
}

export interface MonthlyDataPoint {
  month: string;
  revenue: number;
  total_cts: number;
  cts_pct: number;
}

export interface ChannelSummary {
  channel: Channel;
  avg_cts_pct: number;
  total_revenue: number;
  total_cts: number;
  customer_count: number;
}
