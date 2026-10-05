'use client';

import React from 'react';
import {
  LayoutGrid,
  FileStack,
  ScanLine,
  BrainCircuit,
  SearchCode,
  Landmark,
  FileOutput,
  Network,
  ShieldCheck,
  Cpu,
  Sparkles,
  ChevronRight,
  Activity,
  Map
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingReviewsCount?: number;
  starredQueriesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingReviewsCount = 3,
  starredQueriesCount = 2
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      subtitle: 'KPIs, trends & anomalies',
      icon: LayoutGrid,
      badge: null,
      accentColor: 'emerald'
    },
    {
      id: 'documents',
      label: 'Document Hub & OCR',
      subtitle: 'Uploads & OCR ingest',
      icon: FileStack,
      badge: '109',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      accentColor: 'teal'
    },
    {
      id: 'extraction',
      label: 'Extraction Studio',
      subtitle: 'Split-screen verification',
      icon: ScanLine,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Review` : null,
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
      accentColor: 'amber'
    },
    {
      id: 'ai_assistant',
      label: 'CMPDI AI Copilot',
      subtitle: 'Grounded RAG intelligence',
      icon: BrainCircuit,
      badge: 'RAG v2',
      badgeColor: 'bg-violet-100 text-violet-700 border-violet-200',
      accentColor: 'violet'
    },
    {
      id: 'search',
      label: 'Hybrid Search',
      subtitle: 'Semantic & BM25 search',
      icon: SearchCode,
      badge: null,
      accentColor: 'cyan'
    },
    {
      id: 'parliamentary',
      label: 'Parliamentary Queries',
      subtitle: 'Starred inquiries & draft',
      icon: Landmark,
      badge: starredQueriesCount > 0 ? `${starredQueriesCount} Starred` : null,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
      accentColor: 'rose'
    },
    {
      id: 'reports',
      label: 'Report Generator',
      subtitle: 'Automated PDF/Word/Excel',
      icon: FileOutput,
      badge: 'Multi-Fmt',
      badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
      accentColor: 'teal'
    },
    {
      id: 'analytics',
      label: 'Topics & Word Cloud',
      subtitle: 'Thematic NLP clustering',
      icon: Network,
      badge: null,
      accentColor: 'purple'
    },
    {
      id: 'audit',
      label: 'Immutable Audit Trail',
      subtitle: 'SHA-256 integrity logs',
      icon: ShieldCheck,
      badge: 'Audited',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      accentColor: 'emerald'
    },
    {
      id: 'geomap',
      label: 'GIS Coal Map',
      subtitle: 'State-wise reserve heatmap',
      icon: Map,
      badge: 'Live Map',
      badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      accentColor: 'cyan'
    }
  ];

  const getActiveIconBg = (accent: string) => {
    const map: Record<string, string> = {
      emerald: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25',
      teal: 'bg-gradient-to-br from-teal-500 to-cyan-600 shadow-teal-500/25',
      amber: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/25',
      violet: 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/25',
      cyan: 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/25',
      rose: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/25',
      purple: 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/25',
      indigo: 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/25',
    };
    return map[accent] || map.emerald;
  };

  const getActiveBorderColor = (accent: string) => {
    const map: Record<string, string> = {
      emerald: 'border-emerald-200/80 bg-emerald-50/40',
      teal: 'border-teal-200/80 bg-teal-50/40',
      amber: 'border-amber-200/80 bg-amber-50/40',
      violet: 'border-violet-200/80 bg-violet-50/40',
      cyan: 'border-cyan-200/80 bg-cyan-50/40',
      rose: 'border-rose-200/80 bg-rose-50/40',
      purple: 'border-purple-200/80 bg-purple-50/40',
    };
    return map[accent] || map.emerald;
  };

  return (
    <aside className="w-72 glass border-r border-slate-200/50 flex flex-col justify-between shrink-0 min-h-[calc(100vh-69px)]">
      {/* Navigation Links */}
      <div className="p-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase flex items-center space-x-1.5">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>PLATFORM MODULES</span>
        </div>

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group animate-slide-right stagger-${index + 1} ${
                isActive
                  ? `${getActiveBorderColor(item.accentColor)} font-semibold shadow-sm border backdrop-blur-sm`
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 border border-transparent hover:border-slate-200/40'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? `${getActiveIconBg(item.accentColor)} text-white shadow-md`
                      : 'bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700 group-hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className={`text-xs font-medium truncate ${isActive ? 'text-slate-900' : ''}`}>{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.subtitle}</div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${
                    item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Hardware & Node Status Box */}
      <div className="p-4 m-3 rounded-2xl bg-dark-mesh text-slate-300 text-xs overflow-hidden relative">
        {/* Decorative particles */}
        <div className="absolute top-2 right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1 left-3 w-16 h-16 bg-violet-500/10 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px]">
              <Cpu className="w-3.5 h-3.5" />
              <span className="tracking-wide">AI ENGINE CLUSTER</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ONLINE</span>
            </span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-400">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">OCR Engine:</span>
              <span className="font-mono text-slate-200 text-[10px]">PaddleOCR + Tesseract</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Embeddings:</span>
              <span className="font-mono text-slate-200 text-[10px]">BGE-M3 (768-dim)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Local DB:</span>
              <span className="font-mono text-slate-200 text-[10px]">SQLite + Chroma</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Data Governance:</span>
            <span className="text-amber-400 font-bold tracking-wide flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>STRICT ON-PREM</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
