'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, HardHat, AlertTriangle, CheckCircle2,
  TrendingDown, ClipboardList, Wind, Activity, CalendarDays,
  Building2, Users, Leaf, TreePine, BarChart3, FileWarning,
  Eye, Clock, Search,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, AreaChart, Area,
} from 'recharts';

const safetyKPIs = [
  { label: 'FATAL INCIDENTS YTD', value: 2, prev: 5, unit: '', icon: 'ShieldAlert', color: 'rose' },
  { label: 'LTIFR (per M hrs)', value: 0.38, prev: 0.61, unit: '', icon: 'Activity', color: 'amber' },
  { label: 'DGMS INSPECTIONS', value: 47, prev: 38, unit: '', icon: 'ClipboardList', color: 'emerald' },
  { label: 'COMPLIANCE RATE', value: 94.7, prev: 89.2, unit: '%', icon: 'CheckCircle2', color: 'teal' },
  { label: 'NCR OUTSTANDING', value: 8, prev: 14, unit: '', icon: 'FileWarning', color: 'violet' },
  { label: 'TRAININGS DONE', value: 1248, prev: 980, unit: '', icon: 'Users', color: 'cyan' },
];

const incidentTrend = [
  { month: 'Apr', fatal: 1, serious: 3, minor: 12 },
  { month: 'May', fatal: 0, serious: 2, minor: 9 },
  { month: 'Jun', fatal: 1, serious: 4, minor: 11 },
  { month: 'Jul', fatal: 0, serious: 1, minor: 7 },
  { month: 'Aug', fatal: 0, serious: 2, minor: 8 },
  { month: 'Sep', fatal: 0, serious: 1, minor: 6 },
  { month: 'Oct', fatal: 0, serious: 1, minor: 5 },
];

const subsidiaryCompliance = [
  { name: 'SECL', compliance: 96.2, inspections: 11, ncr: 1, fatalities: 0 },
  { name: 'MCL',  compliance: 97.8, inspections: 8,  ncr: 0, fatalities: 0 },
  { name: 'NCL',  compliance: 93.4, inspections: 7,  ncr: 2, fatalities: 1 },
  { name: 'CCL',  compliance: 91.2, inspections: 6,  ncr: 3, fatalities: 1 },
  { name: 'WCL',  compliance: 94.8, inspections: 7,  ncr: 1, fatalities: 0 },
  { name: 'BCCL', compliance: 92.1, inspections: 5,  ncr: 1, fatalities: 0 },
  { name: 'ECL',  compliance: 95.5, inspections: 3,  ncr: 0, fatalities: 0 },
];

const recentIncidents = [
  { id: 'INC-2024-0891', mine: 'Gevra OC Mine, SECL',      type: 'Equipment Failure', severity: 'MINOR',   date: '2024-10-02', description: 'Conveyor belt malfunction halted coal loading for 4 hours. No injury reported.',                                       status: 'CLOSED',               dgmsRef: 'DGMS/ECZ/2024/0891' },
  { id: 'INC-2024-0854', mine: 'Jhanjra Colliery, ECL',    type: 'Roof Fall',         severity: 'SERIOUS',  date: '2024-09-18', description: 'Minor roof fall in gallery 7-B. 2 workers sustained minor injuries. Area cordoned off.',                           status: 'UNDER INVESTIGATION',  dgmsRef: 'DGMS/ECZ/2024/0854' },
  { id: 'INC-2024-0820', mine: 'Khadia OC Mine, NCL',      type: 'Slope Failure',     severity: 'HIGH',     date: '2024-09-06', description: 'Partial slope instability near bench-12. Evacuation completed. 1 fatality.',                                       status: 'DGMS INQUIRY OPEN',    dgmsRef: 'DGMS/CKZ/2024/0820' },
  { id: 'INC-2024-0801', mine: 'Kathara Colliery, CCL',    type: 'Fire',              severity: 'SERIOUS',  date: '2024-08-29', description: 'Spontaneous combustion in old goaf area. Fire contained by rescue team in 6 hours.',                               status: 'CLOSED',               dgmsRef: 'DGMS/BKZ/2024/0801' },
  { id: 'INC-2024-0777', mine: 'Ballarpur Colliery, WCL',  type: 'Gas Emission',      severity: 'SERIOUS',  date: '2024-08-14', description: 'Elevated CH4 in Level-IV panel. Evacuation triggered. No injury.',                                                 status: 'CLOSED',               dgmsRef: 'DGMS/CNZ/2024/0777' },
];

const environmentalData = [
  { month: 'Apr', trees_planted: 12400, co2_offset_t: 248, green_cover_ha: 142 },
  { month: 'May', trees_planted: 18600, co2_offset_t: 372, green_cover_ha: 158 },
  { month: 'Jun', trees_planted: 24200, co2_offset_t: 484, green_cover_ha: 176 },
  { month: 'Jul', trees_planted: 31500, co2_offset_t: 630, green_cover_ha: 198 },
  { month: 'Aug', trees_planted: 28700, co2_offset_t: 574, green_cover_ha: 212 },
  { month: 'Sep', trees_planted: 19800, co2_offset_t: 396, green_cover_ha: 228 },
  { month: 'Oct', trees_planted: 14200, co2_offset_t: 284, green_cover_ha: 244 },
];

const shiftData = [
  { shift: 'Morning (6-14h)',   workers: 3840, production_mt: 48.2, incidents: 0, efficiency: 94.2 },
  { shift: 'Afternoon (14-22h)',workers: 3620, production_mt: 42.7, incidents: 1, efficiency: 91.8 },
  { shift: 'Night (22-6h)',     workers: 2890, production_mt: 35.1, incidents: 0, efficiency: 88.4 },
];

const severityColor = (s: string) => {
  if (s === 'HIGH' || s === 'FATAL') return 'bg-rose-100 text-rose-700 border-rose-200';
  if (s === 'SERIOUS') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const statusColor = (s: string) => {
  if (s === 'CLOSED') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (s === 'UNDER INVESTIGATION') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-rose-100 text-rose-700 border-rose-200';
};

type ActiveView = 'overview' | 'incidents' | 'environmental' | 'shifts';

export const MineSafetyTab: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<typeof recentIncidents[0] | null>(null);
  const [liveWorkers, setLiveWorkers] = useState(10350);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveWorkers(prev => prev + Math.floor((Math.random() - 0.5) * 20));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = recentIncidents.filter(inc => {
    const q = searchQuery.toLowerCase();
    return inc.mine.toLowerCase().includes(q) || inc.type.toLowerCase().includes(q) || inc.severity.toLowerCase().includes(q);
  });

  const views = [
    { id: 'overview' as ActiveView,     label: 'Safety Overview',      icon: ShieldAlert },
    { id: 'incidents' as ActiveView,    label: 'Incident Register',    icon: FileWarning },
    { id: 'environmental' as ActiveView,label: 'Environmental Impact', icon: Leaf },
    { id: 'shifts' as ActiveView,       label: 'Live Shift Board',     icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-dark-mesh rounded-2xl p-6 text-white shadow-xl border border-slate-700/50 animate-slide-up relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-rose-500/15 text-rose-300 text-xs px-3 py-1.5 rounded-full border border-rose-400/20 mb-4 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span className="tracking-wide text-[11px]">DGMS SAFETY & COMPLIANCE MONITORING — LIVE</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">
              Mine Safety, DGMS Compliance<br />
              <span className="gradient-text-warm text-[20px]">& Environmental Stewardship</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Real-time statutory safety monitoring under the Mines Act 1952, DGMS Regulations, and Ministry of Coal environmental obligations across all 8 CIL subsidiaries.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Workers On-Shift', value: liveWorkers.toLocaleString(), color: 'text-emerald-400', live: true },
              { label: 'Fatalities YTD',   value: '2',     color: 'text-amber-400',  sub: '↓ vs 5 last year' },
              { label: 'Compliance Rate',  value: '94.7%', color: 'text-teal-400',   sub: '↑ vs 89.2% prev' },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl px-4 py-3 text-center min-w-[110px]">
                <div className={	ext-2xl font-extrabold }>{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-1">{stat.label}</div>
                {stat.live ? (
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 font-mono">LIVE</span>
                  </div>
                ) : (
                  <div className="text-[9px] text-emerald-400 font-mono mt-1">{stat.sub}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
        {views.map(v => {
          const Icon = v.icon;
          const isActive = activeView === v.id;
          return (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              className={lex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex-1 justify-center }>
              <Icon className={w-3.5 h-3.5 } />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── OVERVIEW ── */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {safetyKPIs.map((kpi, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-4 card-3d animate-slide-up" style={{ animationDelay: ${idx * 0.06}s }}>
                <div className="text-2xl font-extrabold text-slate-900">{kpi.value}{kpi.unit}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">{kpi.label}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">↓ vs {kpi.prev}{kpi.unit}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100/60">
                <BarChart3 className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Monthly Incident Trend — FY 2024-25</h3>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" tickLine={false} />
                    <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #334155', color: '#fff', fontSize: 11 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="fatal"   name="Fatal"   fill="#ef4444" radius={[4,4,0,0]} />
                    <Bar dataKey="serious" name="Serious" fill="#f59e0b" radius={[4,4,0,0]} />
                    <Bar dataKey="minor"   name="Minor"   fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100/60">
                <Building2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Subsidiary-wise DGMS Compliance</h3>
              </div>
              <div className="space-y-2.5">
                {subsidiaryCompliance.map((sub) => (
                  <div key={sub.name} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-lg w-12 text-center border border-slate-200/60">{sub.name}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-slate-700">{sub.compliance}%</span>
                        {sub.fatalities > 0
                          ? <span className="text-[9px] bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full font-bold">⚠ {sub.fatalities} fatal</span>
                          : <span className="text-[9px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-bold">✓ Zero Fatal</span>}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className={h-2 rounded-full } style={{ width: ${sub.compliance}% }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium w-20 text-right">{sub.inspections} insp</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INCIDENT REGISTER ── */}
      {activeView === 'incidents' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card rounded-xl p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by mine, type, severity..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-[500px]">
            <div className="lg:col-span-2 space-y-3">
              {filteredIncidents.map(inc => (
                <div key={inc.id} onClick={() => setSelectedIncident(inc)}
                  className={glass-card rounded-2xl p-4 cursor-pointer transition-all card-lift border }>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-slate-600">{inc.id}</span>
                    <span className={	ext-[9px] font-bold px-2 py-0.5 rounded-full border }>{inc.severity}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{inc.mine}</h4>
                  <div className="text-[10px] text-slate-500 mb-2">{inc.type} • {inc.date}</div>
                  <span className={	ext-[9px] font-bold px-2 py-0.5 rounded-full border }>{inc.status}</span>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-slate-200/60">
              {selectedIncident ? (
                <div className="space-y-4">
                  <div className="pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-bold text-slate-800">{selectedIncident.id}</span>
                      <span className={	ext-[10px] font-bold px-2.5 py-0.5 rounded-full border }>{selectedIncident.severity}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{selectedIncident.mine}</h3>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-500">
                      <span className="flex items-center space-x-1"><CalendarDays className="w-3 h-3" /><span>{selectedIncident.date}</span></span>
                      <span>•</span><span>{selectedIncident.type}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Incident Description</div>
                    <p className="text-xs text-slate-800 leading-relaxed">{selectedIncident.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">DGMS Reference</div>
                      <div className="font-mono text-[11px] font-bold text-slate-800">{selectedIncident.dgmsRef}</div>
                    </div>
                    <div className={ounded-xl p-3.5 border }>
                      <div className="text-[10px] font-bold uppercase tracking-wide mb-1.5 opacity-70">Status</div>
                      <div className="text-[11px] font-bold">{selectedIncident.status}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                    <button className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-rose-500/20">File DGMS Report</button>
                    <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all">Download Memo</button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <Eye className="w-12 h-12 opacity-30" />
                  <div className="text-sm font-medium text-center">Select an incident to view details</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ENVIRONMENTAL ── */}
      {activeView === 'environmental' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Trees Planted YTD', value: '1,49,400', sub: 'Exceeds MoC mandate +18%', icon: TreePine },
              { label: 'CO₂ Offset (T)',     value: '2,988',   sub: '≡ 1,200 cars removed',    icon: Wind },
              { label: 'Green Cover (Ha)',   value: '244',     sub: 'Active restoration area',  icon: Leaf },
              { label: 'Water Recycled (ML)',value: '182.4',   sub: 'Mine drainage reuse',     icon: Activity },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-card rounded-2xl p-5 card-3d animate-slide-up" style={{ animationDelay: ${idx * 0.08}s }}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{item.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">{item.label}</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-1.5">{item.sub}</div>
                </div>
              );
            })}
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100/60">
              <TreePine className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Afforestation & CO₂ Offset — Monthly Progress</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={environmentalData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cTrees" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                    <linearGradient id="cCO2"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" tickLine={false} />
                  <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #334155', color: '#fff', fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="trees_planted" name="Trees Planted" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#cTrees)" />
                  <Area type="monotone" dataKey="co2_offset_t"  name="CO2 Offset (T)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#cCO2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── LIVE SHIFT BOARD ── */}
      {activeView === 'shifts' && (
        <div className="space-y-5 animate-fade-in">
          <div className="glass-card rounded-2xl p-4 flex items-center space-x-2 text-xs text-emerald-700 border border-emerald-200/60 bg-emerald-50/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="font-semibold">Live data refreshed every 30 seconds from mine dispatch telemetry</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shiftData.map((shift, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 card-3d animate-slide-up" style={{ animationDelay: ${idx * 0.1}s }}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100/60">
                  <div className="flex items-center space-x-2">
                    <span className={w-2.5 h-2.5 rounded-full  animate-pulse} />
                    <span className="font-bold text-xs text-slate-900">{shift.shift}</span>
                  </div>
                  {shift.incidents > 0
                    ? <span className="text-[9px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">⚠ {shift.incidents} alert</span>
                    : <span className="text-[9px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">✓ Clear</span>}
                </div>
                <div className="space-y-3">
                  {[['Workers On-Shift', shift.workers.toLocaleString(), 'text-slate-900'], ['Production (MT)', String(shift.production_mt), 'text-emerald-700'], ['Efficiency', ${shift.efficiency}%, 'text-violet-700']].map(([label, val, cls]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
                      <span className={ont-extrabold text-sm }>{val}</span>
                    </div>
                  ))}
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: ${shift.efficiency}% }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100/60">
              <Activity className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Shift-wise Production Comparison</h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shiftData} layout="vertical" margin={{ top: 5, right: 20, left: 90, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} horizontal={false} />
                  <XAxis type="number" fontSize={11} stroke="#94a3b8" tickLine={false} />
                  <YAxis type="category" dataKey="shift" fontSize={10} stroke="#94a3b8" tickLine={false} width={85} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #334155', color: '#fff', fontSize: 11 }} />
                  <Bar dataKey="production_mt" name="Production (MT)" fill="#10b981" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
