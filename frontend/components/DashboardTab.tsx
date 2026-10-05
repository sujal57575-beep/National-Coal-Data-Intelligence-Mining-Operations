'use client';

import React, { useEffect, useState } from 'react';
import {
  FileStack,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Landmark,
  UploadCloud,
  FileBarChart,
  BrainCircuit,
  Activity,
  ChevronRight,
  Target,
  Gauge,
  BarChart3,
  Flame,
  Pickaxe,
  Factory,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { fetchAnalytics, fetchAIRecommendations, DashboardKPIs, AIRecommendationItem } from '../services/api';
import { getCoalProductionTrend, getUSDtoINR, WorldBankIndicator } from '../services/apiService';

interface DashboardTabProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigateTab }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [worldBankTrend, setWorldBankTrend] = useState<WorldBankIndicator[]>([]);
  const [usdRate, setUsdRate] = useState<number>(83.5);

  useEffect(() => {
    async function loadData() {
      try {
        const [anData, recData, wbTrend, rate] = await Promise.all([
          fetchAnalytics(),
          fetchAIRecommendations(),
          getCoalProductionTrend(),
          getUSDtoINR()
        ]);
        setAnalytics(anData);
        setRecommendations(recData);
        setWorldBankTrend(wbTrend);
        setUsdRate(rate);
      } catch (err) {
        console.error('Error loading dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-slate-500">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-float-3d">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold block">Aggregating National Coal Intelligence</span>
            <span className="text-xs text-slate-400 mt-1 block">Processing metrics from 8 CIL subsidiaries...</span>
          </div>
          <div className="flex space-x-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const kpis: DashboardKPIs = analytics?.kpis || {
    documents_processed: 109,
    extraction_accuracy: 96.2,
    reports_generated: 52,
    queries_resolved: 28,
    automation_rate: 93.4,
    time_reduction_percentage: 91.8,
    average_processing_time_sec: 4.2,
    validation_errors_count: 1,
    pending_reviews_count: 3,
    avg_query_response_time_sec: 1.15
  };

  const productionTrends = analytics?.production_trends || [];
  const subsidiaryPerformance = analytics?.subsidiary_performance || [];
  const anomalies = analytics?.anomalies || [];

  // KPI cards data
  const kpiCards = [
    {
      label: 'DOCUMENTS INDEXED',
      value: kpis.documents_processed,
      suffix: '',
      change: '+12 this week',
      changePositive: true,
      icon: FileStack,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      iconShadow: 'shadow-emerald-500/20',
      desc: 'PDFs, borehole logs, returns & CAD scans'
    },
    {
      label: 'EXTRACTION ACCURACY',
      value: kpis.extraction_accuracy,
      suffix: '%',
      change: 'Verified by CMPDI HQ',
      changePositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      iconShadow: 'shadow-teal-500/20',
      desc: 'Cross-checked with audited balance books'
    },
    {
      label: 'AUTOMATION EFFICIENCY',
      value: kpis.time_reduction_percentage,
      suffix: '%',
      change: 'Cycle Time Saved',
      changePositive: true,
      icon: Gauge,
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
      iconShadow: 'shadow-violet-500/20',
      desc: `Avg doc processing: ${kpis.average_processing_time_sec}s`
    },
    {
      label: 'PENDING REVIEWS',
      value: kpis.pending_reviews_count,
      suffix: '',
      change: 'Action Required',
      changePositive: false,
      icon: Clock,
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      iconShadow: 'shadow-amber-500/20',
      desc: 'Entities awaiting expert review',
      clickable: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner & Quick Action Buttons */}
      <div className="bg-dark-mesh rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700/50 animate-slide-up">
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>
        <div className="absolute left-0 top-1/2 w-48 h-48 bg-cyan-500/6 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/15 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-400/20 mb-4 font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span className="tracking-wide text-[11px]">CMPDI INTELLIGENT AUTOMATION ENGINE ACTIVE</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              National Coal Data Intelligence<br />
              <span className="gradient-text text-[22px]">& Mining Operations Overview</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Real-time synthesis of geological borehole logs, monthly mine production returns, DGMS safety records, and automated parliamentary draft synthesis across all 8 Coal India subsidiaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('documents')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center space-x-2 card-lift"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Ingest Document</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="bg-white/8 hover:bg-white/15 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all border border-white/15 flex items-center space-x-2 card-lift backdrop-blur-sm"
            >
              <FileBarChart className="w-4 h-4 text-emerald-300" />
              <span>Generate Briefing</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai_assistant')}
              className="bg-violet-600/60 hover:bg-violet-600/80 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all border border-violet-400/20 flex items-center space-x-2 card-lift backdrop-blur-sm"
            >
              <BrainCircuit className="w-4 h-4 text-violet-200" />
              <span>Query AI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.clickable ? () => onNavigateTab('extraction') : undefined}
              className={`glass-card rounded-2xl p-5 card-3d animate-slide-up stagger-${idx + 1} ${
                kpi.clickable ? 'cursor-pointer hover:border-amber-300' : ''
              } group`}
            >
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold tracking-wider mb-4">
                <span>{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} text-white flex items-center justify-center shadow-lg ${kpi.iconShadow}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {kpi.value}{kpi.suffix}
                </span>
                <span className={`text-xs font-bold ${kpi.changePositive ? 'text-emerald-600' : 'text-amber-600'} flex items-center`}>
                  {kpi.changePositive && <TrendingUp className="w-3 h-3 mr-0.5" />}
                  {!kpi.changePositive && (
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 text-[10px] font-bold">
                      {kpi.change}
                    </span>
                  )}
                  {kpi.changePositive && kpi.change}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                <span>{kpi.desc}</span>
                {kpi.clickable && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up stagger-5">
        <div className="glass-card rounded-xl p-4 flex items-center space-x-3 card-lift">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{kpis.reports_generated}</div>
            <div className="text-[10px] text-slate-500 font-medium">Reports Generated</div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center space-x-3 card-lift">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{kpis.queries_resolved}</div>
            <div className="text-[10px] text-slate-500 font-medium">AI Queries Resolved</div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center space-x-3 card-lift">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{kpis.automation_rate}%</div>
            <div className="text-[10px] text-slate-500 font-medium">Automation Rate</div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center space-x-3 card-lift">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{kpis.avg_query_response_time_sec}s</div>
            <div className="text-[10px] text-slate-500 font-medium">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Production Trends & Overburden Removal Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up stagger-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100/60 gap-2">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Monthly Coal Production & Overburden Trends
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                FY 2024-25 • Extracted (MT) vs Target & Overburden (M.Cu.m)
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="inline-flex items-center text-slate-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span> Actual MT
              </span>
              <span className="inline-flex items-center text-slate-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-1.5 border border-dashed border-slate-500"></span> Target MT
              </span>
              <span className="inline-flex items-center text-slate-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> OB (M.Cu.m)
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                />
                <Area type="monotone" dataKey="actual_mt" name="Actual (MT)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="target_mt" name="Target (MT)" stroke="#64748b" strokeDasharray="4 4" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="overburden_m_cum" name="Overburden (M.Cu.m)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorOB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Anomalies & Risk Feed */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100/60">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Variance Alerts</h3>
              </div>
              <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                {anomalies.length} Flagged
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {anomalies.map((item: any, idx: number) => {
                const mineName = item.mine || item.title || 'Operational Coal Project';
                const riskLevel = item.risk || item.severity || 'MEDIUM';
                const metricLabel = item.metric || 'Variance Metric';
                const metricVal = item.value || (item.drop_percentage ? `${item.drop_percentage}% variance` : 'Documented');
                const noteText = item.note || item.fact || item.ai_interpretation || 'Discrepancy logged for review.';
                const isHigh = riskLevel === 'HIGH';
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/60 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all card-lift">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-800 flex items-center space-x-1">
                        <Pickaxe className="w-3 h-3 text-slate-500" />
                        <span>{mineName}</span>
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isHigh ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {riskLevel}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">
                      <span className="font-semibold text-slate-900">{metricLabel}:</span> {metricVal}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-relaxed">
                      {noteText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('extraction')}
            className="mt-4 w-full py-3 px-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border border-slate-200/60 card-lift"
          >
            <span>Review Extraction Discrepancies</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subsidiary Performance Comparison Table */}
      <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100/60 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Factory className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                CIL Subsidiary Production & Target Achievement
              </h3>
              <p className="text-xs text-slate-500">
                Annual extraction benchmarks across operating subsidiaries
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-xl border border-emerald-200 font-bold flex items-center space-x-2">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Annual Target: <span className="text-emerald-700">838.0 MT</span></span>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Subsidiary</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Target (MT)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Extracted (MT)</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Achievement %</th>
                <th className="py-3 px-4 rounded-r-xl">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 font-medium">
              {subsidiaryPerformance.map((sub: any, idx: number) => {
                const targetVal = Number(sub?.target_mt ?? sub?.target ?? 0);
                const currentVal = Number(sub?.current_mt ?? sub?.achieved ?? 0);
                const achieveVal = Number(sub?.achievement ?? sub?.achievement_pct ?? (targetVal > 0 ? (currentVal / targetVal) * 100 : 0));
                const isAboveTarget = achieveVal >= 98.0;
                return (
                  <tr key={sub.code || idx} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="py-3.5 px-4 text-slate-900 font-bold flex items-center space-x-2">
                      <Factory className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{sub.name || 'Coal India Subsidiary'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono bg-slate-100 px-2 py-1 rounded-lg text-slate-700 text-[10px] font-bold border border-slate-200/60">
                        {sub.code || 'CIL'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                      {targetVal.toFixed(1)} MT
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-900 font-extrabold whitespace-nowrap">
                      {currentVal.toFixed(1)} MT
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isAboveTarget ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-teal-100 text-teal-700 border border-teal-200'
                      }`}>
                        {achieveVal.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 min-w-[120px]">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
                            isAboveTarget
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                              : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                          }`}
                          style={{ width: `${Math.min(Math.max(achieveVal, 0), 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic AI Recommendations Feed */}
      <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 animate-float-3d">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                AI-Generated Strategic Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Synthesized from borehole lithology logs, dispatch telemetry & sensors
              </p>
            </div>
          </div>
          <span className="bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full border border-violet-200 shadow-sm">
            Intelligence Advisory
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {recommendations.map((rec, idx) => (
            <div
              key={rec.id}
              className={`p-5 rounded-xl border border-slate-200/60 glass-card card-3d flex flex-col justify-between animate-slide-up stagger-${idx + 1}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60">
                    {rec.category}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    rec.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 mb-2 leading-snug">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {rec.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/40">
                <div className="text-[10px] font-bold text-slate-800 mb-1.5">
                  Expected Impact:
                </div>
                <div className="text-[11px] text-violet-700 font-semibold bg-violet-50/80 p-2.5 rounded-lg border border-violet-100 mb-2">
                  {rec.impact_metric}
                </div>
                <div className="text-[10px] text-slate-500">
                  <span className="font-bold text-slate-700">Action:</span> {rec.actionable_step}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
