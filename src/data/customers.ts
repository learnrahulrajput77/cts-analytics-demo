import { generateCustomers } from './generateCustomers';
import type { Customer, MonthlyDataPoint, ChannelSummary, Channel } from './types';

export const CUSTOMERS: readonly Customer[] = Object.freeze(generateCustomers(180));

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const SEASONAL = [0.82,0.80,0.88,0.90,0.92,0.95,0.93,0.97,1.02,1.05,1.15,1.25];

const totalRevenue = CUSTOMERS.reduce((s, c) => s + c.annual_revenue, 0);
const avgCtsPct = CUSTOMERS.reduce((s, c) => s + c.cts_pct, 0) / CUSTOMERS.length;

export const MONTHLY_DATA: MonthlyDataPoint[] = MONTHS.map((month, i) => {
  const noise = 0.97 + Math.sin(i * 2.1) * 0.03;
  const revenue = (totalRevenue / 12) * SEASONAL[i] * noise;
  const cts_pct = avgCtsPct * (1 + Math.cos(i * 1.7) * 0.04);
  return { month, revenue, total_cts: revenue * cts_pct / 100, cts_pct };
});

const CHANNELS: Channel[] = ['Modern Trade','General Trade','E-Commerce','Direct-to-Consumer'];

export const CHANNEL_SUMMARIES: ChannelSummary[] = CHANNELS.map(channel => {
  const group = CUSTOMERS.filter(c => c.channel === channel);
  const total_revenue = group.reduce((s, c) => s + c.annual_revenue, 0);
  const total_cts     = group.reduce((s, c) => s + c.total_cts, 0);
  return {
    channel,
    avg_cts_pct: group.reduce((s, c) => s + c.cts_pct, 0) / group.length,
    total_revenue,
    total_cts,
    customer_count: group.length,
  };
});
