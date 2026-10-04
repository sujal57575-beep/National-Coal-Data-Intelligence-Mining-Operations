'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Bot,
  Search,
  Building,
  FileSpreadsheet,
  Tags,
  ShieldCheck,
  Cpu,
  Database,
  ArrowRightCircle
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
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'documents',
      label: 'Document Hub & OCR',
      subtitle: 'Uploads & OCR ingest',
      icon: FileText,
      badge: '109'
    },
    {
      id: 'extraction',
      label: 'Extraction Studio',
      subtitle: 'Split-screen verification',
      icon: Layers,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Review` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'ai_assistant',
      label: 'CMPDI AI Copilot',
      subtitle: 'Grounded RAG intelligence',
      icon: Bot,
      badge: 'RAG v2',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200'
    },
    {
      id: 'search',
      label: 'Hybrid Search',
      subtitle: 'Semantic & BM25 search',
      icon: Search,
      badge: null
    },
    {
      id: 'parliamentary',
      label: 'Parliamentary Queries',
      subtitle: 'Starred inquiries & draft',
      icon: Building,
      badge: starredQueriesCount > 0 ? `${starredQueriesCount} Starred` : null,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'reports',
      label: 'Report Generator',
      subtitle: 'Automated PDF/Word/Excel',
      icon: FileSpreadsheet,
      badge: 'Multi-Fmt'
    },
    {
      id: 'analytics',
      label: 'Topics & Word Cloud',
      subtitle: 'Thematic NLP clustering',
      icon: Tags,
      badge: null
    },
    {
      id: 'audit',
      label: 'Immutable Audit Trail',
      subtitle: 'SHA-256 integrity logs',
      icon: ShieldCheck,
      badge: 'Audited',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-69px)]">
      {/* Navigation Links */}
      <div className="p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          OPERATIONAL PLATFORM MODULES
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-sky-50 text-sky-900 font-semibold shadow-xs border border-sky-200/80'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-medium truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{item.subtitle}</div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ml-2 ${
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
      <div className="p-4 m-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-sky-400 font-semibold text-[11px]">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI ENGINE CLUSTER</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded">
            OPERATIONAL
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-400">
          <div className="flex justify-between items-center">
            <span>OCR Hybrid Engine:</span>
            <span className="font-mono text-slate-200">Paddle + Tesseract</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Embeddings Model:</span>
            <span className="font-mono text-slate-200">BGE-M3 (768-dim)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Local DB Node:</span>
            <span className="font-mono text-slate-200">SQLite + Chroma</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span>Data Governance:</span>
          <span className="text-amber-400 font-medium">STRICT ON-PREM</span>
        </div>
      </div>
    </aside>
  );
};
