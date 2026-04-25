import type { AISegment, Channel } from '@/data/types';

export const SEGMENT_COLORS: Record<AISegment, string> = {
  'Profitable Stars':   '#22c55e',
  'High CTS Risk':      '#ef4444',
  'Niche Efficient':    '#3b82f6',
  'Growth Opportunity': '#f59e0b',
};

export const SEGMENT_BG: Record<AISegment, string> = {
  'Profitable Stars':   'bg-green-100 text-green-800',
  'High CTS Risk':      'bg-red-100 text-red-800',
  'Niche Efficient':    'bg-blue-100 text-blue-800',
  'Growth Opportunity': 'bg-amber-100 text-amber-800',
};

export const CHANNEL_COLORS: Record<Channel, string> = {
  'Modern Trade':        '#1e3a5f',
  'General Trade':       '#2563eb',
  'E-Commerce':          '#7c3aed',
  'Direct-to-Consumer':  '#f97316',
};

export const CHANNEL_BG: Record<Channel, string> = {
  'Modern Trade':       'bg-slate-100 text-slate-800',
  'General Trade':      'bg-blue-100 text-blue-800',
  'E-Commerce':         'bg-violet-100 text-violet-800',
  'Direct-to-Consumer': 'bg-orange-100 text-orange-800',
};

export const ALL_SEGMENTS: AISegment[] = [
  'Profitable Stars','High CTS Risk','Niche Efficient','Growth Opportunity',
];
