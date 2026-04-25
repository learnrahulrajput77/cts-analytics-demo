import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { MonthlyDataPoint } from '@/data/types';
import { formatCurrency, formatPct } from '@/lib/utils';

interface Props { data: MonthlyDataPoint[] }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="row">
          <span style={{ color: p.color }}>{p.name}</span>
          <span>{p.name === 'Revenue' ? formatCurrency(p.value, true) : formatPct(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueCTSTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tickFormatter={v => `$${(v / 1e6).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${v.toFixed(0)}%`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[10, 25]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#1e3a5f" radius={[4, 4, 0, 0]} opacity={0.85} barSize={20} />
        <Line yAxisId="right" dataKey="cts_pct" name="CTS %" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3, fill: '#f97316' }} type="monotone" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
