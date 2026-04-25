# CTS Analytics Demo — Claude Guide

## Project Overview
Executive demo webapp showcasing AI/ML usage in "Cost to Serve" (CTS) analytics for a CPG company. Synthetic mock data only, no backend. Three pages: Overview Dashboard, AI Segmentation, What-If Simulator.

## Stack
- React 18 + TypeScript (strict mode)
- Vite 6 with `@/` alias pointing to `src/`
- Tailwind CSS v3 (not v4)
- Recharts v2 (not v3)
- Radix UI: react-select v2, react-slider v1
- Lucide React for icons

## Commands
```bash
npm run dev       # start dev server (localhost:5173)
npm run build     # tsc -b && vite build
npm run preview   # preview production build
```

## Project Structure
```
src/
  data/           # types.ts, generateCustomers.ts, customers.ts
  lib/            # ctsFormulas.ts, segmentColors.ts, utils.ts
  components/
    layout/       # Sidebar, TopBar, Layout
    ui/           # card, badge, select, slider (Radix wrappers)
    overview/     # KpiCard, ChannelBarChart, RevenueCTSTrendChart, CustomerProfitabilityTable
    segmentation/ # SegmentScatterPlot, AIInsightPanel
    simulator/    # SliderPanel, BeforeAfterSummary, CostDriverBarChart, SavingsCallout
  pages/          # OverviewPage, SegmentationPage, SimulatorPage
```

## Design Tokens
- Sidebar background: `#1e3a5f` (dark navy)
- Accent / CTA color: `#f97316` (orange-500)
- CTS risk threshold: **18%** (used as reference line in charts)
- Revenue threshold: **$1M** (used as quadrant boundary in scatter plot)
- Sidebar width CSS var: `--sidebar-width: 240px`

## Data & Business Logic
- 180 synthetic customers generated with seeded LCG (seed=42) — deterministic
- Four channels: Modern Trade, General Trade, E-Commerce, DTC
- Four AI segments: Profitable Stars / High CTS Risk / Niche Efficient / Growth Opportunity
- CTS formula uses non-linear power law multipliers: freight (0.6 exponent for consolidation, 0.8 for frequency), warehouse (0.7 for inventory)
- All exported data arrays are `Object.freeze()`-d — never mutate them

## Key Conventions
- Use `cn()` from `src/lib/utils.ts` for all Tailwind class merging
- Use `formatCurrency()`, `formatPct()`, `formatNumber()` from utils for all display values
- CSS imports must use relative paths (`./index.css`), not the `@/` alias
- Colors for segments and channels come from `src/lib/segmentColors.ts` — don't hardcode elsewhere
- `SEGMENT_COLORS`, `CHANNEL_COLORS`, `CHANNEL_BG` are the canonical color maps

## Known Issues / Tech Debt
- Several components missing `useMemo` for expensive computations (sort in CustomerProfitabilityTable, filter in SegmentScatterPlot, aggregations in AIInsightPanel, makeConfigs in SliderPanel)
- NAV_ITEMS in Sidebar.tsx should be moved outside the component (contains JSX, causes re-renders)
- Slider thumb color uses inline `#2563eb` instead of Tailwind class
- Segment toggle buttons missing `aria-pressed` for accessibility
- Magic numbers 18 and 1000000 (revenue/CTS thresholds) are scattered — candidate for a `constants.ts`

## GitHub
Repository: https://github.com/learnrahulrajput77/cts-analytics-demo
