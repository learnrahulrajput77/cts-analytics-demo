import type { Customer, AISegment, Channel } from '@/data/types';
import { SEGMENT_COLORS, ALL_SEGMENTS } from '@/lib/segmentColors';
import { formatPct, formatCurrency } from '@/lib/utils';
import { Star, AlertTriangle, Zap, TrendingUp } from 'lucide-react';

const SEGMENT_ICONS: Record<AISegment, React.ReactNode> = {
  'Profitable Stars':   <Star size={14} />,
  'High CTS Risk':      <AlertTriangle size={14} />,
  'Niche Efficient':    <Zap size={14} />,
  'Growth Opportunity': <TrendingUp size={14} />,
};

const SEGMENT_ACTION: Record<AISegment, string> = {
  'Profitable Stars':   'Protect & grow',
  'High CTS Risk':      'Optimize or reprice',
  'Niche Efficient':    'Monitor & scale',
  'Growth Opportunity': 'Invest selectively',
};

interface Props {
  customers: readonly Customer[];
  selectedChannel: Channel | 'All';
}

export function AIInsightPanel({ customers, selectedChannel }: Props) {
  const filtered = customers.filter(c => selectedChannel === 'All' || c.channel === selectedChannel);

  return (
    <div className="space-y-2">
      {ALL_SEGMENTS.map(seg => {
        const group = filtered.filter(c => c.ai_segment === seg);
        if (!group.length) return null;
        const avgCts    = group.reduce((s, c) => s + c.cts_pct, 0) / group.length;
        const totalRev  = group.reduce((s, c) => s + c.annual_revenue, 0);
        const color     = SEGMENT_COLORS[seg];

        return (
          <div key={seg} className="rounded-lg border p-3" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color }}>{SEGMENT_ICONS[seg]}</span>
              <span className="text-xs font-semibold text-slate-700">{seg}</span>
              <span className="ml-auto text-xs font-bold text-slate-500">{group.length} accounts</span>
            </div>
            <div className="flex gap-3 text-xs text-slate-500">
              <span>Avg CTS <b className="text-slate-700">{formatPct(avgCts)}</b></span>
              <span>Revenue <b className="text-slate-700">{formatCurrency(totalRev, true)}</b></span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 italic">{SEGMENT_ACTION[seg]}</p>
          </div>
        );
      })}
    </div>
  );
}
