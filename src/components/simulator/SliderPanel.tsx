import { Slider } from '@/components/ui/slider';
import type { SimulatorState, Customer } from '@/data/types';
import { formatCurrency } from '@/lib/utils';

interface SliderConfig {
  key: keyof SimulatorState;
  label: string;
  min: number; max: number; step: number;
  format: (v: number) => string;
}

function makeConfigs(baseline: Customer): SliderConfig[] {
  return [
    { key: 'order_frequency',  label: 'Order Frequency', min: 0.5, max: 2.0, step: 0.1, format: v => `${v.toFixed(1)}×` },
    { key: 'avg_order_size',   label: 'Avg Order Size',  min: Math.max(100, baseline.avg_order_size * 0.2), max: baseline.avg_order_size * 3, step: 100, format: v => formatCurrency(v, true) },
    { key: 'route_efficiency', label: 'Route Efficiency', min: 60, max: 100, step: 1, format: v => `${v}%` },
    { key: 'promo_multiplier', label: 'Promo Spend',     min: 0.5, max: 2.0, step: 0.1, format: v => `${v.toFixed(1)}×` },
    { key: 'return_rate',      label: 'Return Rate',     min: 0,   max: 25,  step: 0.5, format: v => `${v.toFixed(1)}%` },
  ];
}

interface Props {
  state: SimulatorState;
  baseline: Customer;
  onChange: (field: keyof SimulatorState, value: number) => void;
}

export function SliderPanel({ state, baseline, onChange }: Props) {
  const configs = makeConfigs(baseline);

  return (
    <div className="space-y-5">
      {configs.map(cfg => {
        const val  = state[cfg.key] as number;
        const base = cfg.key === 'order_frequency' ? 1.0
                   : cfg.key === 'avg_order_size'   ? baseline.avg_order_size
                   : cfg.key === 'route_efficiency' ? 100
                   : cfg.key === 'promo_multiplier' ? 1.0
                   : baseline.return_rate_pct;
        const diff = val - base;
        const isChanged = Math.abs(diff) > 0.001;

        return (
          <div key={cfg.key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{cfg.label}</span>
              <div className="flex items-center gap-2">
                {isChanged && (
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${diff > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {diff > 0 ? '+' : ''}{cfg.format(diff)} vs baseline
                  </span>
                )}
                <span className="text-sm font-bold text-slate-900 min-w-[60px] text-right">{cfg.format(val)}</span>
              </div>
            </div>
            <Slider
              min={cfg.min} max={cfg.max} step={cfg.step}
              value={[val]}
              onValueChange={([v]) => onChange(cfg.key, v)}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{cfg.format(cfg.min)}</span>
              <span>{cfg.format(cfg.max)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
