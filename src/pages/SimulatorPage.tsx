import { useState, useMemo } from 'react';
import type { Customer, SimulatorState } from '@/data/types';
import { baselineCosts, computeAfterCosts, defaultSimulatorState } from '@/lib/ctsFormulas';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SliderPanel } from '@/components/simulator/SliderPanel';
import { BeforeAfterSummary } from '@/components/simulator/BeforeAfterSummary';
import { CostDriverBarChart } from '@/components/simulator/CostDriverBarChart';
import { SavingsCallout } from '@/components/simulator/SavingsCallout';
import { SEGMENT_BG, CHANNEL_BG } from '@/lib/segmentColors';
import { formatCurrency, formatPct } from '@/lib/utils';

interface Props { customers: readonly Customer[] }

export function SimulatorPage({ customers }: Props) {
  const sorted = useMemo(() => [...customers].sort((a, b) => a.customer_name.localeCompare(b.customer_name)), [customers]);

  const [selectedId, setSelectedId] = useState<string>(sorted[0].customer_id);
  const [state, setState] = useState<SimulatorState>(() => defaultSimulatorState(sorted[0]));

  const customer = useMemo(() => customers.find(c => c.customer_id === selectedId) ?? sorted[0], [customers, selectedId, sorted]);

  function handleCustomerChange(id: string) {
    const c = customers.find(c => c.customer_id === id) ?? sorted[0];
    setSelectedId(id);
    setState(defaultSimulatorState(c));
  }

  function handleSliderChange(field: keyof SimulatorState, value: number) {
    setState(prev => ({ ...prev, [field]: value }));
  }

  const before = useMemo(() => baselineCosts(customer), [customer]);
  const after  = useMemo(() => computeAfterCosts(customer, state), [customer, state]);

  return (
    <div>
      <TopBar
        title="What-If Cost Simulator"
        subtitle="Model scenario changes and see real-time impact on cost to serve"
        aiPowered
      />

      {/* Customer selector */}
      <div className="flex items-center gap-4 mb-5 p-4 bg-white rounded-xl border border-slate-200">
        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Simulating for:</span>
        <Select value={selectedId} onValueChange={handleCustomerChange}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sorted.map(c => (
              <SelectItem key={c.customer_id} value={c.customer_id}>
                {c.customer_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge className={CHANNEL_BG[customer.channel]}>{customer.channel}</Badge>
        <Badge className={SEGMENT_BG[customer.ai_segment]}>{customer.ai_segment}</Badge>
        <div className="ml-auto flex gap-4 text-sm text-slate-500">
          <span>Revenue <b className="text-slate-800">{formatCurrency(customer.annual_revenue, true)}</b></span>
          <span>Baseline CTS <b className="text-slate-800">{formatPct(customer.cts_pct)}</b></span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sliders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">Scenario Controls</CardTitle>
            <p className="text-xs text-slate-400">Adjust levers to model different scenarios</p>
          </CardHeader>
          <CardContent>
            <SliderPanel state={state} baseline={customer} onChange={handleSliderChange} />
            <button
              onClick={() => setState(defaultSimulatorState(customer))}
              className="mt-5 w-full text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
            >
              Reset to baseline
            </button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="xl:col-span-2 space-y-4">
          {/* Savings callout */}
          <SavingsCallout before={before} after={after} />

          {/* Before/After + Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-700">Before vs After</CardTitle>
                <p className="text-xs text-slate-400">Key metrics comparison</p>
              </CardHeader>
              <CardContent>
                <BeforeAfterSummary before={before} after={after} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-700">Cost Driver Breakdown</CardTitle>
                <p className="text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-navy inline-block" style={{ backgroundColor: '#1e3a5f' }} />
                    Before
                  </span>
                  {' '}vs{' '}
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#f97316' }} />
                    After
                  </span>
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <CostDriverBarChart before={before} after={after} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
