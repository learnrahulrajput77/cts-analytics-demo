import { useMemo, useState } from 'react';
import { DollarSign, Users, AlertTriangle, Lightbulb } from 'lucide-react';
import type { Customer } from '@/data/types';
import { MONTHLY_DATA, CHANNEL_SUMMARIES } from '@/data/customers';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/overview/KpiCard';
import { ChannelBarChart } from '@/components/overview/ChannelBarChart';
import { RevenueCTSTrendChart } from '@/components/overview/RevenueCTSTrendChart';
import { CustomerProfitabilityTable } from '@/components/overview/CustomerProfitabilityTable';
import { formatCurrency, formatPct } from '@/lib/utils';

interface Props { customers: readonly Customer[] }

export function OverviewPage({ customers }: Props) {
  const [tableMode, setTableMode] = useState<'top' | 'bottom'>('bottom');

  const kpis = useMemo(() => {
    const totalCTS     = customers.reduce((s, c) => s + c.total_cts, 0);
    const avgCTS       = totalCTS / customers.length;
    const aboveThresh  = customers.filter(c => c.cts_pct > 18).length;
    const pctAbove     = (aboveThresh / customers.length) * 100;
    const savings      = customers
      .filter(c => c.ai_segment === 'High CTS Risk')
      .reduce((s, c) => s + c.total_cts * 0.15, 0);
    return { totalCTS, avgCTS, pctAbove, savings };
  }, [customers]);

  return (
    <div>
      <TopBar
        title="Cost to Serve — Overview"
        subtitle="AI-powered analytics across all channels and customers"
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Cost to Serve"
          value={formatCurrency(kpis.totalCTS, true)}
          change="Across all channels"
          changeType="neutral"
          icon={<DollarSign size={18} />}
          accentColor="#1e3a5f"
        />
        <KpiCard
          title="Avg CTS per Customer"
          value={formatCurrency(kpis.avgCTS, true)}
          change="180 active accounts"
          changeType="neutral"
          icon={<Users size={18} />}
          accentColor="#2563eb"
        />
        <KpiCard
          title="Customers Above Threshold"
          value={formatPct(kpis.pctAbove, 0)}
          change={`${customers.filter(c => c.cts_pct > 18).length} accounts above 18% CTS`}
          changeType="negative"
          icon={<AlertTriangle size={18} />}
          accentColor="#ef4444"
        />
        <KpiCard
          title="AI Savings Opportunity"
          value={formatCurrency(kpis.savings, true)}
          change="Est. 15% reduction in High CTS Risk"
          changeType="positive"
          icon={<Lightbulb size={18} />}
          accentColor="#f97316"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">Average CTS % by Channel</CardTitle>
            <p className="text-xs text-slate-400">Red line = 18% profitability threshold</p>
          </CardHeader>
          <CardContent>
            <ChannelBarChart data={[...CHANNEL_SUMMARIES]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">Revenue vs CTS % — Monthly Trend</CardTitle>
            <p className="text-xs text-slate-400">Bars = revenue (left), Line = CTS % (right)</p>
          </CardHeader>
          <CardContent>
            <RevenueCTSTrendChart data={MONTHLY_DATA} />
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm text-slate-700">
                {tableMode === 'bottom' ? 'Highest CTS % Accounts' : 'Most Profitable Accounts'}
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Top 10 customers sorted by CTS %</p>
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {(['bottom', 'top'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setTableMode(mode)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    tableMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {mode === 'bottom' ? 'High CTS Risk' : 'Most Profitable'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CustomerProfitabilityTable customers={customers} mode={tableMode} />
        </CardContent>
      </Card>
    </div>
  );
}
