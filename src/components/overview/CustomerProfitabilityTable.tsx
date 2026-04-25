import type { Customer } from '@/data/types';
import { Badge } from '@/components/ui/badge';
import { SEGMENT_BG, CHANNEL_BG } from '@/lib/segmentColors';
import { formatCurrency, formatPct } from '@/lib/utils';

interface Props {
  customers: readonly Customer[];
  mode: 'top' | 'bottom';
  limit?: number;
}

export function CustomerProfitabilityTable({ customers, mode, limit = 10 }: Props) {
  const sorted = [...customers]
    .sort((a, b) => mode === 'top' ? a.cts_pct - b.cts_pct : b.cts_pct - a.cts_pct)
    .slice(0, limit);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {['#', 'Customer', 'Channel', 'Revenue', 'CTS', 'CTS %', 'Segment'].map(h => (
              <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, i) => (
            <tr
              key={c.customer_id}
              className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                c.cts_pct > 22 ? 'bg-red-50/50' : c.cts_pct < 10 ? 'bg-green-50/50' : ''
              }`}
            >
              <td className="py-2.5 px-3 text-slate-400 text-xs">{i + 1}</td>
              <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">{c.customer_name}</td>
              <td className="py-2.5 px-3">
                <Badge className={CHANNEL_BG[c.channel]}>{c.channel}</Badge>
              </td>
              <td className="py-2.5 px-3 text-slate-700">{formatCurrency(c.annual_revenue, true)}</td>
              <td className="py-2.5 px-3 text-slate-700">{formatCurrency(c.total_cts, true)}</td>
              <td className="py-2.5 px-3">
                <span className={`font-semibold ${c.cts_pct > 22 ? 'text-red-600' : c.cts_pct < 10 ? 'text-green-600' : 'text-slate-700'}`}>
                  {formatPct(c.cts_pct)}
                </span>
              </td>
              <td className="py-2.5 px-3">
                <Badge className={SEGMENT_BG[c.ai_segment]}>{c.ai_segment}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
