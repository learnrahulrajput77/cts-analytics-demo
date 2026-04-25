import { TrendingDown, TrendingUp } from 'lucide-react';
import type { CostBreakdown } from '@/data/types';
import { formatCurrency, formatPct } from '@/lib/utils';

interface Props { before: CostBreakdown; after: CostBreakdown }

export function SavingsCallout({ before, after }: Props) {
  const delta    = before.total_cts - after.total_cts;
  const deltaPct = Math.abs(delta / before.total_cts) * 100;
  const isSaving = delta > 0;

  return (
    <div className={`rounded-xl p-4 border-2 ${isSaving ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSaving ? 'bg-green-100' : 'bg-red-100'}`}>
          {isSaving
            ? <TrendingDown size={18} className="text-green-600" />
            : <TrendingUp   size={18} className="text-red-600" />
          }
        </div>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isSaving ? 'text-green-700' : 'text-red-700'}`}>
            {isSaving ? 'Savings Opportunity' : 'Cost Increase Warning'}
          </p>
          <p className={`text-2xl font-bold ${isSaving ? 'text-green-700' : 'text-red-700'}`}>
            {isSaving ? '-' : '+'}{formatCurrency(Math.abs(delta), true)} / year
          </p>
          <p className={`text-sm mt-0.5 ${isSaving ? 'text-green-600' : 'text-red-600'}`}>
            {formatPct(deltaPct)} {isSaving ? 'reduction' : 'increase'} in CTS
          </p>
        </div>
      </div>
    </div>
  );
}
