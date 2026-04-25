import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
  accentColor?: string;
}

export function KpiCard({ title, value, change, changeType = 'neutral', icon, description, accentColor = '#2563eb' }: KpiCardProps) {
  const ChangeIcon = changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : Minus;
  const changeColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-slate-500';

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: accentColor }} />
      <CardContent className="pt-5 pl-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${changeColor}`}>
                <ChangeIcon size={12} />
                {change}
              </div>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ml-3"
               style={{ backgroundColor: `${accentColor}18` }}>
            <span style={{ color: accentColor }}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
