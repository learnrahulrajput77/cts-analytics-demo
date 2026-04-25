import { ArrowRight } from 'lucide-react';
import type { CostBreakdown } from '@/data/types';
import { formatCurrency, formatPct } from '@/lib/utils';

interface MetricRow {
  label: string;
  before: string;
  after: string;
  improved: boolean;
}

interface Props { before: CostBreakdown; after: CostBreakdown }

export function BeforeAfterSummary({ before, after }: Props) {
  const rows: MetricRow[] = [
    {
      label: 'Total CTS',
      before: formatCurrency(before.total_cts),
      after:  formatCurrency(after.total_cts),
      improved: after.total_cts < before.total_cts,
    },
    {
      label: 'CTS as % of Revenue',
      before: formatPct(before.cts_pct),
      after:  formatPct(after.cts_pct),
      improved: after.cts_pct < before.cts_pct,
    },
    {
      label: 'Net Margin',
      before: formatPct(before.net_margin_pct),
      after:  formatPct(after.net_margin_pct),
      improved: after.net_margin_pct > before.net_margin_pct,
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map(row => (
        <div key={row.label} className="rounded-lg bg-slate-50 px-4 py-3">
          <p className="text-xs text-slate-500 mb-2 font-medium">{row.label}</p>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-slate-600">{row.before}</span>
            <ArrowRight size={14} className="text-slate-400 flex-shrink-0" />
            <span className={`text-base font-bold ${row.improved ? 'text-green-600' : 'text-red-600'}`}>
              {row.after}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
