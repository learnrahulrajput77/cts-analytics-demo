import { Sparkles } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  aiPowered?: boolean;
}

export function TopBar({ title, subtitle, aiPowered }: TopBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {aiPowered && (
        <div className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          <Sparkles size={12} />
          Powered by AI
        </div>
      )}
    </div>
  );
}
