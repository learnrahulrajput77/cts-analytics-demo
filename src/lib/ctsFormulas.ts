import type { Customer, SimulatorState, CostBreakdown } from '@/data/types';

export function baselineCosts(c: Customer): CostBreakdown {
  return {
    freight_cost:          c.freight_cost,
    warehouse_cost:        c.warehouse_cost,
    order_processing_cost: c.order_processing_cost,
    promo_cost:            c.promo_cost,
    returns_cost:          c.returns_cost,
    total_cts:             c.total_cts,
    cts_pct:               c.cts_pct,
    net_margin_pct:        c.net_margin_pct,
  };
}

export function defaultSimulatorState(c: Customer): SimulatorState {
  return {
    order_frequency:  1.0,
    avg_order_size:   c.avg_order_size,
    route_efficiency: 100,
    promo_multiplier: 1.0,
    return_rate:      c.return_rate_pct,
  };
}

export function computeAfterCosts(baseline: Customer, state: SimulatorState): CostBreakdown {
  const baseVolume = baseline.annual_revenue / baseline.avg_order_size;
  const newVolume  = baseline.annual_revenue / state.avg_order_size;

  const freqFactor          = state.order_frequency;
  const efficiencyFactor    = 100 / Math.max(state.route_efficiency, 1);
  const consolidationFactor = baseline.avg_order_size / state.avg_order_size;
  const inventoryFactor     = (state.avg_order_size / baseline.avg_order_size) *
                               (baseline.order_frequency_per_year / (baseline.order_frequency_per_year * freqFactor));

  const freight_cost = baseline.freight_cost
    * efficiencyFactor
    * Math.pow(consolidationFactor, 0.6)
    * Math.pow(freqFactor, 0.8);

  const warehouse_cost = baseline.warehouse_cost * Math.pow(Math.max(inventoryFactor, 0.1), 0.7);

  const order_processing_cost = baseline.order_processing_cost * (newVolume / baseVolume);

  const promo_cost = baseline.promo_cost * state.promo_multiplier;

  const returns_cost = baseline.returns_cost
    * (state.return_rate / Math.max(baseline.return_rate_pct, 0.1));

  const total_cts    = freight_cost + warehouse_cost + order_processing_cost + promo_cost + returns_cost;
  const cts_pct      = (total_cts / baseline.annual_revenue) * 100;
  const net_margin_pct = ((baseline.annual_revenue - total_cts) / baseline.annual_revenue) * 100;

  return {
    freight_cost,
    warehouse_cost,
    order_processing_cost,
    promo_cost,
    returns_cost,
    total_cts,
    cts_pct,
    net_margin_pct,
  };
}

export const COST_DRIVER_LABELS: Record<keyof Omit<CostBreakdown,'total_cts'|'cts_pct'|'net_margin_pct'>, string> = {
  freight_cost:          'Freight',
  warehouse_cost:        'Warehouse',
  order_processing_cost: 'Order Processing',
  promo_cost:            'Promotions',
  returns_cost:          'Returns',
};
