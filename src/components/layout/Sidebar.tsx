import { LayoutDashboard, ScatterChart, Sliders, Sparkles, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId = 'overview' | 'segmentation' | 'simulator';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',      label: 'Overview',         icon: <LayoutDashboard size={18} /> },
  { id: 'segmentation',  label: 'AI Segmentation',  icon: <ScatterChart size={18} /> },
  { id: 'simulator',     label: 'What-If Simulator', icon: <Sliders size={18} /> },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-20"
      style={{ width: 'var(--sidebar-width)', background: '#1e3a5f' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
            <TrendingDown size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">CTS Intelligence</p>
            <p className="text-blue-300 text-[10px] leading-tight mt-0.5">AI Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-3">
          Analytics
        </p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              activeTab === item.id
                ? 'bg-white/15 text-white'
                : 'text-blue-200 hover:bg-white/8 hover:text-white'
            )}
          >
            <span className={activeTab === item.id ? 'text-orange-400' : ''}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer badge */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/8 rounded-lg px-3 py-2">
          <Sparkles size={13} className="text-orange-400 flex-shrink-0" />
          <span className="text-[11px] text-blue-200">Powered by AI/ML</span>
        </div>
      </div>
    </aside>
  );
}
