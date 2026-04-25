import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import type { ChannelSummary } from '@/data/types';
import { CHANNEL_COLORS } from '@/lib/segmentColors';
import { formatPct } from '@/lib/utils';

interface Props { data: ChannelSummary[] }

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChannelSummary }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="label">{d.channel}</p>
      <div className="row"><span>Avg CTS %</span><span>{formatPct(d.avg_cts_pct)}</span></div>
      <div className="row"><span>Customers</span><span>{d.customer_count}</span></div>
    </div>
  );
}

export function ChannelBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 5 }} barSize={36}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 30]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
        <ReferenceLine y={18} stroke="#ef4444" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: 'Threshold 18%', position: 'right', fontSize: 10, fill: '#ef4444' }} />
        <Bar dataKey="avg_cts_pct" radius={[6, 6, 0, 0]}>
          {data.map(d => (
            <Cell key={d.channel} fill={CHANNEL_COLORS[d.channel]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
