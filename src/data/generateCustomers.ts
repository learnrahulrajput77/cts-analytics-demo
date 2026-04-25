import type { Customer, Channel, AISegment } from './types';

function makeLCG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const PREFIXES = [
  'Metro','Crown','Peak','Allied','Global','Sunrise','National','Summit',
  'Premier','Apex','Pinnacle','Regional','Central','Delta','Horizon',
  'Bridge','Coastal','Capital','Heritage','Union','Sterling','Keystone',
  'Zenith','Crest','Monarch','Cascade','Redwood','Beacon','Valor','Ember',
];

const SUFFIXES = [
  'Retail','Mart','Stores','Distributors','Commerce','Trading',
  'Supply','Wholesale','Express','Group','Network','Partners',
];

const CHANNELS: Channel[] = [
  'Modern Trade','General Trade','E-Commerce','Direct-to-Consumer',
];

const CHANNEL_WEIGHTS = [0.35, 0.30, 0.20, 0.15];

function pickChannel(r: number): Channel {
  let cum = 0;
  for (let i = 0; i < CHANNELS.length; i++) {
    cum += CHANNEL_WEIGHTS[i];
    if (r < cum) return CHANNELS[i];
  }
  return CHANNELS[CHANNELS.length - 1];
}

function logUniform(rand: () => number, min: number, max: number): number {
  return Math.exp(Math.log(min) + rand() * (Math.log(max) - Math.log(min)));
}

interface ChannelParams {
  revMin: number; revMax: number;
  orderMin: number; orderMax: number;
  freqMin: number; freqMax: number;
  distMin: number; distMax: number;
  returnMin: number; returnMax: number;
  promoMin: number; promoMax: number;
}

const CHANNEL_PARAMS: Record<Channel, ChannelParams> = {
  'Modern Trade':        { revMin:800000, revMax:5000000, orderMin:8000,  orderMax:25000, freqMin:24,  freqMax:52,  distMin:100, distMax:800, returnMin:1,  returnMax:5,  promoMin:0.04, promoMax:0.12 },
  'General Trade':       { revMin:200000, revMax:1500000, orderMin:2000,  orderMax:8000,  freqMin:12,  freqMax:36,  distMin:50,  distMax:400, returnMin:2,  returnMax:8,  promoMin:0.03, promoMax:0.08 },
  'E-Commerce':          { revMin:150000, revMax:2000000, orderMin:500,   orderMax:3000,  freqMin:50,  freqMax:200, distMin:20,  distMax:600, returnMin:5,  returnMax:20, promoMin:0.02, promoMax:0.15 },
  'Direct-to-Consumer':  { revMin:50000,  revMax:600000,  orderMin:80,    orderMax:500,   freqMin:12,  freqMax:100, distMin:10,  distMax:200, returnMin:3,  returnMax:15, promoMin:0.05, promoMax:0.20 },
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function assignSegment(revenue: number, ctsPct: number): AISegment {
  const REV_THRESHOLD = 1_000_000;
  const CTS_THRESHOLD = 18;
  const isHighRev = revenue >= REV_THRESHOLD;
  const isHighCTS = ctsPct >= CTS_THRESHOLD;
  if (isHighRev && !isHighCTS) return 'Profitable Stars';
  if (isHighRev && isHighCTS)  return 'High CTS Risk';
  if (!isHighRev && !isHighCTS) return 'Niche Efficient';
  return 'Growth Opportunity';
}

export function generateCustomers(count = 180): Customer[] {
  const rand = makeLCG(42);
  const usedNames = new Set<string>();
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const channel = pickChannel(rand());
    const p = CHANNEL_PARAMS[channel];

    let name = '';
    let attempts = 0;
    while (!name || usedNames.has(name)) {
      const prefix = PREFIXES[Math.floor(rand() * PREFIXES.length)];
      const suffix = SUFFIXES[Math.floor(rand() * SUFFIXES.length)];
      name = `${prefix} ${suffix}`;
      if (++attempts > 200) { name = `${name} ${i}`; break; }
    }
    usedNames.add(name);

    const annual_revenue = logUniform(rand, p.revMin, p.revMax);
    const avg_order_size = logUniform(rand, p.orderMin, p.orderMax);
    const order_frequency_per_year = p.freqMin + rand() * (p.freqMax - p.freqMin);
    const distance_km = p.distMin + rand() * (p.distMax - p.distMin);
    const return_rate_pct = p.returnMin + rand() * (p.returnMax - p.returnMin);
    const promo_rate = p.promoMin + rand() * (p.promoMax - p.promoMin);

    const order_volume = annual_revenue / avg_order_size;

    const freight_cost = clamp(
      distance_km * order_volume * 0.15 * (0.8 + rand() * 0.4),
      annual_revenue * 0.03,
      annual_revenue * 0.18
    );

    const warehouse_cost = clamp(
      order_volume * avg_order_size * 0.025 * (1 + rand() * 0.3),
      annual_revenue * 0.01,
      annual_revenue * 0.10
    );

    const order_processing_cost = clamp(
      order_volume * 45 * (0.75 + rand() * 0.5),
      annual_revenue * 0.005,
      annual_revenue * 0.05
    );

    const promo_cost = annual_revenue * promo_rate;

    const returns_cost = annual_revenue * (return_rate_pct / 100) * 0.30;

    const total_cts = freight_cost + warehouse_cost + order_processing_cost + promo_cost + returns_cost;
    const cts_pct = (total_cts / annual_revenue) * 100;
    const net_margin_pct = ((annual_revenue - total_cts) / annual_revenue) * 100;
    const ai_segment = assignSegment(annual_revenue, cts_pct);

    customers.push({
      customer_id: `C${String(i + 1).padStart(3, '0')}`,
      customer_name: name,
      channel,
      annual_revenue,
      freight_cost,
      warehouse_cost,
      order_processing_cost,
      promo_cost,
      returns_cost,
      total_cts,
      avg_order_size,
      order_frequency_per_year,
      distance_km,
      return_rate_pct,
      cts_pct,
      net_margin_pct,
      order_volume,
      ai_segment,
    });
  }

  return customers;
}
