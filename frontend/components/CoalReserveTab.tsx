'use client';

import React, { useState } from 'react';
import { Database, Map, BarChart3, TrendingUp, Info, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Treemap } from 'recharts';

const stateReserves = [
  { state: 'Jharkhand',    proved: 40862, indicated: 29453, inferred: 14211, total: 84526, rank: 1, category: 'Gondwana', quality: 'Coking + Steam' },
  { state: 'Odisha',       proved: 37394, indicated: 24871, inferred: 15092, total: 77357, rank: 2, category: 'Gondwana', quality: 'Steam / Thermal' },
  { state: 'Chhattisgarh', proved: 31201, indicated: 22984, inferred: 12401, total: 66586, rank: 3, category: 'Gondwana', quality: 'Thermal' },
  { state: 'West Bengal',  proved: 17214, indicated: 11203, inferred:  6024, total: 34441, rank: 4, category: 'Gondwana', quality: 'Coking' },
  { state: 'Madhya Pradesh',proved:15823, indicated: 12491, inferred:  8234, total: 36548, rank: 5, category: 'Gondwana', quality: 'Thermal' },
  { state: 'Telangana',    proved:  9234, indicated:  6512, inferred:  3421, total: 19167, rank: 6, category: 'Gondwana', quality: 'Thermal' },
  { state: 'Maharashtra',  proved:  7845, indicated:  5234, inferred:  3012, total: 16091, rank: 7, category: 'Gondwana', quality: 'Thermal' },
  { state: 'Assam',        proved:   654, indicated:   432, inferred:   213, total:  1299, rank: 8, category: 'Tertiary', quality: 'Sub-bituminous' },
  { state: 'Meghalaya',    proved:   441, indicated:   312, inferred:   185, total:   938, rank: 9, category: 'Tertiary', quality: 'Sub-bituminous' },
];

const COLORS = ['#10b981','#06b6d4','#8b5cf6','#f59e0b','#ef4444','#3b82f6','#ec4899','#84cc16','#f97316'];

const gradeBreakdown = [
  { grade: 'Coking (P/S)',   mt: 32480, pct: 11.2 },
  { grade: 'Thermal G1-G3', mt: 48920, pct: 16.9 },
  { grade: 'Thermal G4-G6', mt: 89340, pct: 30.8 },
  { grade: 'Thermal G7-G10',mt: 76120, pct: 26.3 },
  { grade: 'Lignite/Sub',   mt: 43140, pct: 14.8 },
];

const mineLifeData = [
  { name: 'Gevra OC',       reserves_mt: 1240, annual_mt: 48.2, life_years: 26, subsidiary: 'SECL' },
  { name: 'Kusmunda OC',    reserves_mt:  980, annual_mt: 42.1, life_years: 23, subsidiary: 'SECL' },
  { name: 'Jayant OC',      reserves_mt:  710, annual_mt: 38.4, life_years: 18, subsidiary: 'NCL'  },
  { name: 'Khadia OC',      reserves_mt:  540, annual_mt: 27.9, life_years: 19, subsidiary: 'NCL'  },
  { name: 'Belpahar OC',    reserves_mt:  620, annual_mt: 28.5, life_years: 22, subsidiary: 'MCL'  },
  { name: 'Samaleswari OC', reserves_mt:  480, annual_mt: 24.2, life_years: 20, subsidiary: 'MCL'  },
  { name: 'East Bokaro',    reserves_mt:  310, annual_mt: 14.8, life_years: 21, subsidiary: 'BCCL' },
  { name: 'Dhanbad UG',     reserves_mt:  180, annual_mt:  8.4, life_years: 21, subsidiary: 'BCCL' },
];

type View = 'statewise' | 'grade' | 'mine_life';

export const CoalReserveTab: React.FC = () => {
  const [view, setView] = useState<View>('statewise');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedState, setExpandedState] = useState<string | null>(null);

  const totalReserves = stateReserves.reduce((s, r) => s + r.total, 0);
  const totalProved = stateReserves.reduce((s, r) => s + r.proved, 0);

  const filteredStates = stateReserves.filter(r =>
    r.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pieData = stateReserves.map(r => ({ name: r.state, value: r.total }));

  const views = [
    { id: 'statewise' as View, label: 'State-wise Reserves' },
    { id: 'grade'    as View, label: 'Coal Grade Breakup' },
    { id: 'mine_life'as View, label: 'Mine Life Analysis' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-dark-mesh rounded-2xl p-6 text-white shadow-xl border border-slate-700/50 animate-slide-up relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-cyan-500/15 text-cyan-300 text-xs px-3 py-1.5 rounded-full border border-cyan-400/20 mb-4 font-bold">
              <Database className="w-3.5 h-3.5" />
              <span className="tracking-wide text-[11px]">GSI NATIONAL COAL GEOLOGICAL INVENTORY — FY 2024</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">
              National Coal Reserve Inventory<br />
              <span className="gradient-text-cool text-[20px]">& Geological Resource Atlas</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Geological Survey of India (GSI) certified national coal resource database integrating 9-state reserve data, coal grade classifications, and mine-life projections as per UNFC framework.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total National Reserves', value: `${(totalReserves / 1000).toFixed(0)}  BT`, color: 'text-cyan-400' },
              { label: 'Proved Reserves',          value: `${(totalProved  / 1000).toFixed(0)} BT`,  color: 'text-emerald-400' },
              { label: 'Coal-Bearing States',       value: '9',                                        color: 'text-violet-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl px-4 py-3 text-center min-w-[120px]">
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${view === v.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-700'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── STATE-WISE ── */}
      {view === 'statewise' && (
        <div className="space-y-5 animate-fade-in">
          <div className="glass-card rounded-xl p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by state or geological category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Bar Chart */}
            <div className="lg:col-span-3 glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100/60">
                <BarChart3 className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Proved vs Indicated vs Inferred (MT)</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredStates} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis dataKey="state" fontSize={9} stroke="#94a3b8" tickLine={false} angle={-35} textAnchor="end" />
                    <YAxis fontSize={10} stroke="#94a3b8" tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #334155', color: '#fff', fontSize: 11 }} formatter={(v: any) => [`${v.toLocaleString()} MT`]} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="proved"    name="Proved"    fill="#10b981" stackId="a" radius={[0,0,0,0]} />
                    <Bar dataKey="indicated" name="Indicated" fill="#06b6d4" stackId="a" />
                    <Bar dataKey="inferred"  name="Inferred"  fill="#8b5cf6" stackId="a" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100/60">
                <Map className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Distribution by State</h3>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v.toLocaleString()} MT`]} contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #334155', color: '#fff', fontSize: 11 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Expandable State Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Proved (MT)</th>
                  <th className="py-3 px-4 text-right">Indicated (MT)</th>
                  <th className="py-3 px-4 text-right">Inferred (MT)</th>
                  <th className="py-3 px-4 text-right">Total (MT)</th>
                  <th className="py-3 px-4">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {filteredStates.map(r => (
                  <React.Fragment key={r.state}>
                    <tr className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setExpandedState(expandedState === r.state ? null : r.state)}>
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: COLORS[(r.rank - 1) % COLORS.length] }}>{r.rank}</span>
                        <span>{r.state}</span>
                        {expandedState === r.state ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                      </td>
                      <td className="py-3.5 px-4"><span className="bg-cyan-100 text-cyan-700 border border-cyan-200 text-[9px] font-bold px-2 py-0.5 rounded-full">{r.category}</span></td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">{r.proved.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">{r.indicated.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">{r.inferred.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">{r.total.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-20">
                            <div className="h-1.5 rounded-full" style={{ width: `${(r.total / totalReserves) * 100}%`, background: COLORS[(r.rank - 1) % COLORS.length] }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">{((r.total / totalReserves) * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                    {expandedState === r.state && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div><span className="text-slate-500 font-medium">Coal Quality:</span> <span className="font-bold text-slate-800">{r.quality}</span></div>
                            <div><span className="text-slate-500 font-medium">Geological Age:</span> <span className="font-bold text-slate-800">{r.category} Formation</span></div>
                            <div><span className="text-slate-500 font-medium">Exploration Status:</span> <span className="font-bold text-emerald-700">GSI Certified</span></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GRADE BREAKUP ── */}
      {view === 'grade' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {gradeBreakdown.map((g, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 card-3d animate-slide-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="text-xl font-extrabold text-slate-900">{g.mt.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">{g.grade}</div>
                <div className="text-[10px] text-violet-700 font-semibold mt-1">{g.pct}% of total</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-3 border-b border-slate-100/60">Coal Grade Distribution — National Reserve (MT)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gradeBreakdown} cx="50%" cy="50%" outerRadius={110} dataKey="mt" nameKey="grade" paddingAngle={3}>
                    {gradeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v.toLocaleString()} MT`]} contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #334155', color: '#fff', fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── MINE LIFE ── */}
      {view === 'mine_life' && (
        <div className="space-y-5 animate-fade-in">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100/60">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Major Mine Reserves & Projected Life (Years)</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mineLifeData} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="name" fontSize={9} stroke="#94a3b8" tickLine={false} angle={-35} textAnchor="end" />
                  <YAxis yAxisId="left" fontSize={10} stroke="#94a3b8" tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" fontSize={10} stroke="#94a3b8" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: '1px solid #334155', color: '#fff', fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="reserves_mt" name="Reserves (MT)" fill="#10b981" radius={[4,4,0,0]} />
                  <Bar yAxisId="right" dataKey="life_years" name="Life (Years)" fill="#8b5cf6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Mine</th>
                  <th className="py-3 px-4">Subsidiary</th>
                  <th className="py-3 px-4 text-right">Reserves (MT)</th>
                  <th className="py-3 px-4 text-right">Annual Output (MT)</th>
                  <th className="py-3 px-4 text-center">Projected Life</th>
                  <th className="py-3 px-4">Life Indicator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {mineLifeData.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3.5 px-4"><span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/60">{m.subsidiary}</span></td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">{m.reserves_mt.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">{m.annual_mt}</td>
                    <td className="py-3.5 px-4 text-center"><span className={`font-bold text-sm ${m.life_years >= 25 ? 'text-emerald-700' : m.life_years >= 20 ? 'text-amber-700' : 'text-rose-700'}`}>{m.life_years} yrs</span></td>
                    <td className="py-3.5 px-4">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${m.life_years >= 25 ? 'bg-emerald-500' : m.life_years >= 20 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(m.life_years * 3, 100)}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
