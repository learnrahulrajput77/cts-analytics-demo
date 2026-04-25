import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Label,
} from 'recharts';
import type { Customer, Channel, AISegment } from '@/data/types';
import { SEGMENT_COLORS, ALL_SEGMENTS } from '@/lib/segmentColors';
import { formatCurrency, formatPct } from '@/lib/utils';

interface Props {
  customers: readonly Customer[];
  selectedChannel: Channel | 'All';
  activeSegments: Set<AISegment>;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Customer }> }) {
  if (!active || !payload?.length) return null;
  const c = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="label">{c.customer_name}</p>
      <div className="row"><span>Channel</span><span>{c.channel}</span></div>
      <div className="row"><span>Revenue</span><span>{formatCurrency(c.annual_revenue, true)}</span></div>
      <div className="row"><span>Total CTS</span><span>{formatCurrency(c.total_cts, true)}</span></div>
      <div className="row"><span>CTS %</span><span style={{ color: c.cts_pct > 18 ? '#ef4444' : '#22c55e' }}>{formatPct(c.cts_pct)}</span></div>
      <div className="row"><span>Segment</span><span>{c.ai_segment}</span></div>
    </div>
  );
}

export function SegmentScatterPlot({ customers, selectedChannel, activeSegments }: Props) {
  const filtered = customers.filter(c =>
    (selectedChannel === 'All' || c.channel === selectedChannel) &&
    activeSegments.has(c.ai_segment)
  );

  const bySegment = ALL_SEGMENTS.map(seg => ({
    seg,
    data: filtered
      .filter(c => c.ai_segment === seg)
      .map(c => ({ ...c, x: c.annual_revenue, y: c.cts_pct, z: c.order_volume })),
  }));

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          type="number" dataKey="x" name="Revenue"
          domain={[0, 5_500_000]}
          tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`}
          tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
        >
          <Label value="Annual Revenue" position="insideBottom" offset={-15} style={{ fontSize: 11, fill: '#94a3b8' }} />
        </XAxis>
        <YAxis
          type="number" dataKey="y" name="CTS %"
          domain={[0, 35]}
          tickFormatter={v => `${v}%`}
          tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
        >
          <Label value="CTS as % of Revenue" angle={-90} position="insideLeft" offset={10} style={{ fontSize: 11, fill: '#94a3b8' }} />
        </YAxis>
        <ZAxis type="number" dataKey="z" range={[40, 300]} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <ReferenceLine x={1_000_000} stroke="#cbd5e1" strokeDasharray="6 3" strokeWidth={1.5} />
        <ReferenceLine y={18} stroke="#cbd5e1" strokeDasharray="6 3" strokeWidth={1.5} />
        {bySegment.map(({ seg, data }) => (
          <Scatter
            key={seg}
            name={seg}
            data={data}
            fill={SEGMENT_COLORS[seg]}
            fillOpacity={0.75}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
