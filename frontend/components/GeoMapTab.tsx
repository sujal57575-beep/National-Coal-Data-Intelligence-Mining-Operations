'use client';
/**
 * GeoMapTab.tsx
 * Thin wrapper — loads the Leaflet map with next/dynamic (ssr:false)
 * so the browser-only Leaflet library never runs on the server.
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { Globe, Loader2 } from 'lucide-react';

// ── Dynamically import the actual Leaflet map (no SSR) ──────────────────────
const MapInner = dynamic(
  () => import('./MapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-slate-900/80 rounded-2xl" style={{ height: 580 }}>
        <div className="flex flex-col items-center space-y-4 text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/25 animate-pulse">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-300">Initialising OpenStreetMap…</p>
            <p className="text-xs text-slate-500 mt-1">Loading Leaflet + tile layers</p>
          </div>
          <div className="flex space-x-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

// ─────────────────────────────────────────────────────────────────────────────

export const GeoMapTab: React.FC = () => {
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              National Coal Reserve — GIS Intelligence Map
            </h2>
            <p className="text-xs text-slate-500">
              Real-time interactive map · Click coalfield circles for live environmental data
            </p>
          </div>
        </div>

        {/* API Attribution Badges */}
        <div className="flex items-center flex-wrap gap-2">
          {[
            { name: 'OpenStreetMap', color: 'bg-green-50 text-green-700 border-green-200' },
            { name: 'Nominatim', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { name: 'Overpass API', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { name: 'Open-Meteo', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
            { name: 'CartoDB Tiles', color: 'bg-slate-50 text-slate-600 border-slate-200' },
          ].map(api => (
            <span key={api.name} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${api.color}`}>
              {api.name}
            </span>
          ))}
        </div>
      </div>

      {/* The actual map (loaded client-side only) */}
      <MapInner />
    </div>
  );
};
