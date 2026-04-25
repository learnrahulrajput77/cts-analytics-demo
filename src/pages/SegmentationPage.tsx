import { useState } from 'react';
import type { Customer, Channel, AISegment } from '@/data/types';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SegmentScatterPlot } from '@/components/segmentation/SegmentScatterPlot';
import { AIInsightPanel } from '@/components/segmentation/AIInsightPanel';
import { ALL_SEGMENTS, SEGMENT_COLORS } from '@/lib/segmentColors';

interface Props { customers: readonly Customer[] }

const CHANNELS: (Channel | 'All')[] = ['All', 'Modern Trade', 'General Trade', 'E-Commerce', 'Direct-to-Consumer'];

export function SegmentationPage({ customers }: Props) {
  const [channel, setChannel] = useState<Channel | 'All'>('All');
  const [activeSegments, setActiveSegments] = useState<Set<AISegment>>(new Set(ALL_SEGMENTS));

  function toggleSegment(seg: AISegment) {
    setActiveSegments(prev => {
      const next = new Set(prev);
      if (next.has(seg)) { if (next.size > 1) next.delete(seg); }
      else next.add(seg);
      return next;
    });
  }

  return (
    <div>
      <TopBar
        title="AI Customer Segmentation"
        subtitle="ML-driven clustering of customers by revenue and cost-to-serve profile"
        aiPowered
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Scatter plot */}
        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-sm text-slate-700">Revenue vs CTS % — Customer Map</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Bubble size = order volume · Dashed lines = quadrant boundaries</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Segment toggles */}
                <div className="flex gap-2 flex-wrap">
                  {ALL_SEGMENTS.map(seg => (
                    <button
                      key={seg}
                      onClick={() => toggleSegment(seg)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        activeSegments.has(seg) ? 'text-white border-transparent' : 'bg-white text-slate-400 border-slate-200'
                      }`}
                      style={activeSegments.has(seg) ? { backgroundColor: SEGMENT_COLORS[seg], borderColor: SEGMENT_COLORS[seg] } : {}}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeSegments.has(seg) ? 'white' : SEGMENT_COLORS[seg] }} />
                      {seg}
                    </button>
                  ))}
                </div>
                {/* Channel filter */}
                <Select value={channel} onValueChange={v => setChannel(v as Channel | 'All')}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map(ch => (
                      <SelectItem key={ch} value={ch}>{ch === 'All' ? 'All Channels' : ch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quadrant labels */}
            <div className="grid grid-cols-2 gap-2 mt-3 px-1">
              {[
                { label: 'Profitable Stars', color: '#22c55e', desc: 'High Revenue · Low CTS' },
                { label: 'High CTS Risk',    color: '#ef4444', desc: 'High Revenue · High CTS' },
                { label: 'Niche Efficient',  color: '#3b82f6', desc: 'Low Revenue · Low CTS' },
                { label: 'Growth Opportunity', color: '#f59e0b', desc: 'Low Revenue · High CTS' },
              ].map(q => (
                <div key={q.label} className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: q.color }} />
                  <span><b>{q.label}</b> — {q.desc}</span>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <SegmentScatterPlot customers={customers} selectedChannel={channel} activeSegments={activeSegments} />
          </CardContent>
        </Card>

        {/* Insight panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-700">AI Segment Insights</CardTitle>
            <p className="text-xs text-slate-400">Recommended actions per segment</p>
          </CardHeader>
          <CardContent className="pt-0">
            <AIInsightPanel customers={customers} selectedChannel={channel} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
