import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { CostBreakdown } from '@/data/types';
import { COST_DRIVER_LABELS } from '@/lib/ctsFormulas';
import { formatCurrency } from '@/lib/utils';

interface Props { before: CostBreakdown; after: CostBreakdown }

type DriverKey = keyof typeof COST_DRIVER_LABELS;

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="row">
          <span style={{ color: p.color }}>{p.name}</span>
          <span>{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
}

export function CostDriverBarChart({ before, after }: Props) {
  const data = (Object.keys(COST_DRIVER_LABELS) as DriverKey[]).map(k => ({
    name: COST_DRIVER_LABELS[k],
    Before: Math.round(before[k] as number),
    After:  Math.round(after[k]  as number),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="Before" fill="#1e3a5f" radius={[4, 4, 0, 0]} barSize={18} />
        <Bar dataKey="After"  fill="#f97316" radius={[4, 4, 0, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
