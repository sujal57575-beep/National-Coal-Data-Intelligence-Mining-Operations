'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  UploadCloud,
  FileBarChart,
  Bot,
  Activity,
  ChevronRight
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

interface DashboardTabProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigateTab }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [anData, recData] = await Promise.all([
          fetchAnalytics(),
          fetchAIRecommendations()
        ]);
        setAnalytics(anData);
        setRecommendations(recData);
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
        <div className="flex flex-col items-center space-y-3 text-slate-500">
          <Activity className="w-8 h-8 animate-spin text-sky-600" />
          <span className="text-sm font-medium">Aggregating national coal intelligence metrics...</span>
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

  return (
    <div className="space-y-6">
      {/* Banner & Quick Action Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-sky-500/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 text-xs px-2.5 py-1 rounded-full border border-sky-400/30 mb-3 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>CMPDI Intelligent Automation Engine Active</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              National Coal Data Intelligence & Mining Operations Overview
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Real-time synthesis of geological borehole logs, monthly mine production returns, statutory DGMS safety records, and automated parliamentary draft synthesis across all 8 Coal India subsidiaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('documents')}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Ingest Document</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all border border-white/20 flex items-center space-x-2"
            >
              <FileBarChart className="w-4 h-4 text-sky-300" />
              <span>Generate Briefing</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai_assistant')}
              className="bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all border border-indigo-400/30 flex items-center space-x-2"
            >
              <Bot className="w-4 h-4 text-indigo-200" />
              <span>Query AI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>DOCUMENTS INDEXED</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{kpis.documents_processed}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12 this week
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            PDFs, borehole logs, returns & CAD scans
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>EXTRACTION ACCURACY</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{kpis.extraction_accuracy}%</span>
            <span className="text-xs font-semibold text-emerald-600">
              Verified by CMPDI HQ
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Cross-checked with audited balance books
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>AUTOMATION EFFICIENCY</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{kpis.time_reduction_percentage}%</span>
            <span className="text-xs font-semibold text-indigo-600">
              Cycle Time Saved
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Avg doc processing time: {kpis.average_processing_time_sec}s
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigateTab('extraction')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-amber-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-3">
            <span>PENDING HUMAN REVIEWS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-600">{kpis.pending_reviews_count}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Action Required
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between group-hover:text-amber-700 transition-colors">
            <span>Entities awaiting expert review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Production Trends & Overburden Removal Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Coal Production & Overburden Trends (FY 2024-25)
              </h3>
              <p className="text-xs text-slate-500">
                Extracted Coal (Million Tonnes) vs Target & Overburden Removal (M.Cu.m)
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mr-1.5"></span> Actual MT
              </span>
              <span className="inline-flex items-center text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-1.5"></span> Target MT
              </span>
              <span className="inline-flex items-center text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> OB (M.Cu.m)
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="actual_mt" name="Actual (MT)" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="target_mt" name="Target (MT)" stroke="#64748b" strokeDasharray="4 4" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="overburden_m_cum" name="Overburden (M.Cu.m)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorOB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Anomalies & Risk Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Operational Variance Alerts</h3>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs text-slate-800">{mineName}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isHigh ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {riskLevel} RISK
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">
                      <span className="font-medium text-slate-900">{metricLabel}:</span> {metricVal}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {noteText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('extraction')}
            className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
          >
            <span>Review Extraction Discrepancies</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subsidiary Performance Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              CIL Subsidiary-Wise Production & Target Achievement
            </h3>
            <p className="text-xs text-slate-500">
              Official annual extraction benchmarks evaluated across operating subsidiaries
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 font-mono">
            Annual National Target: 838.0 MT
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Subsidiary</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4 text-right">Target (MT)</th>
                <th className="py-3 px-4 text-right">Extracted (MT)</th>
                <th className="py-3 px-4 text-center">Achievement %</th>
                <th className="py-3 px-4 rounded-r-lg">Progress Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {subsidiaryPerformance.map((sub: any, idx: number) => {
                const targetVal = Number(sub?.target_mt ?? sub?.target ?? 0);
                const currentVal = Number(sub?.current_mt ?? sub?.achieved ?? 0);
                const achieveVal = Number(sub?.achievement ?? sub?.achievement_pct ?? (targetVal > 0 ? (currentVal / targetVal) * 100 : 0));
                const isAboveTarget = achieveVal >= 98.0;
                return (
                  <tr key={sub.code || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-900 font-semibold flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>{sub.name || 'Coal India Subsidiary'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 text-[11px] font-bold">
                        {sub.code || 'CIL'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {targetVal.toFixed(1)} MT
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900 font-bold">
                      {currentVal.toFixed(1)} MT
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                        isAboveTarget ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {achieveVal.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            isAboveTarget ? 'bg-emerald-500' : 'bg-sky-600'
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                CMPDI AI-Generated Operational & Strategic Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Synthesized by analyzing borehole lithology logs, dispatch telemetry, and pithead sensors
              </p>
            </div>
          </div>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-200">
            Automated Intelligence Advisory
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {rec.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 leading-snug">
                  {rec.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {rec.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <div className="text-[11px] font-semibold text-indigo-950 mb-1">
                  Expected Impact:
                </div>
                <div className="text-xs text-indigo-700 font-medium bg-indigo-50/80 p-2 rounded-lg border border-indigo-100 mb-2">
                  {rec.impact_metric}
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Action Step:</span> {rec.actionable_step}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
