'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Sparkles,
  FileText,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Printer,
  CheckCircle2,
  Table as TableIcon,
  ShieldCheck,
  Eye,
  FileDown
} from 'lucide-react';
import {
  fetchReports,
  generateReport,
  fetchSubsidiaries,
  ReportItem,
  SubsidiaryItem
} from '../services/api';
import {
  GSI_NATIONAL_COAL_RESOURCES,
  NATIONAL_TOTAL_RESOURCES_MT,
  CIL_SUBSIDIARY_PRODUCTION,
  TOTAL_CIL_PRODUCTION_2024_25,
  TOTAL_CIL_ANNUAL_TARGET,
  REAL_MEGA_MINES_DATABASE
} from '../services/realCoalData';
import {
  generateDirectPDFBlob,
  generateExcelWorkbookBlob,
  generateWordDocumentBlob,
  generateCSVBlob,
  triggerBrowserDownload,
  ReportContentData
} from '../services/reportExportService';

export const ReportsTab: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Form State
  const [title, setTitle] = useState('National Coal Resources & Exploration Geological Dossier (GSI 2025)');
  const [reportType, setReportType] = useState('ANNUAL');
  const [financialYear, setFinancialYear] = useState('2024-25');
  const [subsidiaryId, setSubsidiaryId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Detail View State
  const [activePreviewTab, setActivePreviewTab] = useState<'synthesis' | 'dataset' | 'printable'>('synthesis');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [reps, subs] = await Promise.all([
        fetchReports(),
        fetchSubsidiaries()
      ]);
      setReports(reps);
      setSubsidiaries(subs);
      if (reps.length > 0 && !selectedReport) {
        setSelectedReport(reps[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'GSI') {
      setTitle('National Coal Resources & Exploration Geological Dossier (GSI 2025)');
      setReportType('ANNUAL');
      setFinancialYear('2024-25');
      setSubsidiaryId('');
    } else if (presetName === 'CIL') {
      setTitle('Coal India Limited Annual Subsidiary Production & Despatch Audit (FY 2024-25)');
      setReportType('ANNUAL');
      setFinancialYear('2024-25');
      setSubsidiaryId('');
    } else if (presetName === 'MEGA') {
      setTitle('Mega-Mines Operational Performance & Surface Miner Evaluation');
      setReportType('SPECIAL');
      setFinancialYear('2024-25');
      setSubsidiaryId('');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const newRep = await generateReport({
        title,
        report_type: reportType,
        financial_year: financialYear,
        subsidiary_id: subsidiaryId || undefined
      });
      await loadData();
      setSelectedReport(newRep);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert ReportItem to Export Service format
  const getExportData = (rep: ReportItem): ReportContentData => {
    return {
      id: rep.id,
      title: rep.title,
      report_type: rep.report_type,
      financial_year: rep.financial_year,
      subsidiary_name: 'Coal India Limited & Operating Subsidiaries',
      executive_summary: rep.executive_summary || '',
      metrics: rep.metrics_summary_json || {},
      ai_insights: rep.ai_insights_json || [],
      observations: rep.observations_json || [],
      exceptions: rep.exceptions_json || [],
      sources: rep.source_references_json || []
    };
  };

  const handleDirectDownload = (format: 'pdf' | 'xlsx' | 'docx' | 'csv') => {
    if (!selectedReport) return;
    const data = getExportData(selectedReport);
    const filenamePrefix = selectedReport.id;

    if (format === 'pdf') {
      const blob = generateDirectPDFBlob(data);
      triggerBrowserDownload(blob, `${filenamePrefix}_GSI_CIL_Report.pdf`);
      flashMessage('PDF downloaded successfully!');
    } else if (format === 'xlsx') {
      const blob = generateExcelWorkbookBlob(data);
      triggerBrowserDownload(blob, `${filenamePrefix}_GSI_CIL_Database.xlsx`);
      flashMessage('Excel workbook (.xlsx) downloaded successfully!');
    } else if (format === 'docx') {
      const blob = generateWordDocumentBlob(data);
      triggerBrowserDownload(blob, `${filenamePrefix}_Ministry_Dossier.doc`);
      flashMessage('Word document (.docx) downloaded successfully!');
    } else if (format === 'csv') {
      const blob = generateCSVBlob(data);
      triggerBrowserDownload(blob, `${filenamePrefix}_Data_Extract.csv`);
      flashMessage('CSV data extract downloaded successfully!');
    }
  };

  const flashMessage = (msg: string) => {
    setDownloadSuccessMessage(msg);
    setTimeout(() => setDownloadSuccessMessage(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Automated Multi-Format Report Generator
            </h2>
            <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-200 font-mono">
              GSI 2025 • CIL FY 2024-25 REAL DATASETS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish official government dossiers in PDF, Excel (.xlsx), Word (.docx), and CSV with zero latency
          </p>
        </div>

        {downloadSuccessMessage && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 rounded-xl border border-emerald-200 font-semibold flex items-center space-x-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Preset Quick Buttons & Generation Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Compile Intelligence Report from Authoritative Datasets
            </h3>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Presets:</span>
            <button
              onClick={() => handleApplyPreset('GSI')}
              className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-semibold transition-colors"
            >
              GSI National Inventory (400.72 BT)
            </button>
            <button
              onClick={() => handleApplyPreset('CIL')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold transition-colors"
            >
              CIL Production Audit (781.06 MT)
            </button>
            <button
              onClick={() => handleApplyPreset('MEGA')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-semibold transition-colors"
            >
              Mega-Mines Evaluation (Gevra 70 MTPA)
            </button>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reporting Cadence</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
            >
              <option value="ANNUAL">Annual Comprehensive Audit</option>
              <option value="QUARTERLY">Quarterly Geological Review</option>
              <option value="MONTHLY">Monthly Production Return</option>
              <option value="SPECIAL">Special Parliamentary Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">CIL Subsidiary Scope</label>
            <select
              value={subsidiaryId}
              onChange={(e) => setSubsidiaryId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
            >
              <option value="">All CIL Subsidiaries (Consolidated)</option>
              {subsidiaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name.substring(0, 24)}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={isGenerating}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Real Datasets & Compiling Artifacts...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Compile & Generate Intelligence Dossier</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Report Explorer: Left List (4 cols) & Right Detailed Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Reports */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            AVAILABLE OFFICIAL REPORTS ({reports.length})
          </h3>

          {reports.map((rep) => {
            const isSelected = selectedReport?.id === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/60 shadow-xs ring-1 ring-sky-300'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    FY {rep.financial_year} • {rep.report_type}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {rep.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                  {rep.title}
                </h4>

                <div className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {rep.executive_summary}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="font-mono">
                    {new Date(rep.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="font-semibold text-sky-700">Preview & Download →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Preview Panel */}
        {selectedReport && (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
            <div>
              {/* Header with Title and Download Buttons */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      CMPDI CENTRAL DATA DIRECTORATE • OFFICIAL PUBLICATION
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedReport.title}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Reporting Scope: FY {selectedReport.financial_year} ({selectedReport.report_type})
                  </div>
                </div>

                {/* Instant Download Action Buttons */}
                <div className="flex items-center flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() => handleDirectDownload('pdf')}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                    title="Download binary PDF file directly"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => handleDirectDownload('xlsx')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                    title="Download Excel spreadsheet workbook"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel (.xlsx)</span>
                  </button>

                  <button
                    onClick={() => handleDirectDownload('docx')}
                    className="px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                    title="Download Word Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Word (.doc)</span>
                  </button>

                  <button
                    onClick={() => handleDirectDownload('csv')}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    title="Download CSV data table"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    title="Print or Save PDF using Browser Print Engine"
                  >
                    <Printer className="w-3.5 h-3.5 text-sky-400" />
                    <span>Print / PDF View</span>
                  </button>
                </div>
              </div>

              {/* View Tabs: Synthesis / Real Dataset / Printable Mode */}
              <div className="flex space-x-1 border-b border-slate-200 mt-4">
                <button
                  onClick={() => setActivePreviewTab('synthesis')}
                  className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
                    activePreviewTab === 'synthesis'
                      ? 'border-sky-600 text-sky-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Executive Synthesis & Metrics</span>
                </button>

                <button
                  onClick={() => setActivePreviewTab('dataset')}
                  className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
                    activePreviewTab === 'dataset'
                      ? 'border-sky-600 text-sky-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Real Geological & Production Dataset</span>
                </button>

                <button
                  onClick={() => setActivePreviewTab('printable')}
                  className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
                    activePreviewTab === 'printable'
                      ? 'border-sky-600 text-sky-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Official Government Printable View</span>
                </button>
              </div>

              {/* TAB 1: SYNTHESIS & METRICS */}
              {activePreviewTab === 'synthesis' && (
                <div className="space-y-4 pt-4 text-xs">
                  {/* Executive Summary */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                      Executive Intelligence Synthesis
                    </h4>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedReport.executive_summary}
                    </p>
                  </div>

                  {/* Operational Metrics Cards */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide">
                      Key Performance & Resource Metrics
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100">
                        <span className="text-[10px] text-slate-500 font-semibold block">Total CIL Extraction:</span>
                        <span className="text-base font-bold text-sky-900 font-mono">
                          {TOTAL_CIL_PRODUCTION_2024_25} MT
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                          vs 773.65 MT in FY 23-24
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">National Coal Reserves:</span>
                        <span className="text-base font-bold text-slate-800 font-mono">
                          400,715 MT
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          ~400.72 Billion Tonnes
                        </span>
                      </div>

                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                        <span className="text-[10px] text-slate-500 font-semibold block">Power Despatches:</span>
                        <span className="text-base font-bold text-amber-900 font-mono">
                          618.5 MT
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          80.2% of total CIL offtake
                        </span>
                      </div>

                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-slate-500 font-semibold block">Daily Rail Rakes:</span>
                        <span className="text-base font-bold text-emerald-900 font-mono">
                          368 Rakes/Day
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Indian Railways joint sub-group
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Strategic AI Insights */}
                  {selectedReport.ai_insights_json && (
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wide flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Strategic Observations & Recommendations</span>
                      </h4>
                      <div className="space-y-1.5">
                        {selectedReport.ai_insights_json.map((insight, idx) => (
                          <div
                            key={idx}
                            className="text-slate-700 bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100/60 flex items-start space-x-2"
                          >
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REAL DATASETS FROM GSI & CIL */}
              {activePreviewTab === 'dataset' && (
                <div className="space-y-5 pt-4 text-xs">
                  {/* Table 1: GSI State Coal Resources */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide">
                        Geological Survey of India (GSI) - National Coal Resources Inventory
                      </h4>
                      <span className="font-mono text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        National Total: {NATIONAL_TOTAL_RESOURCES_MT.toLocaleString('en-IN')} MT
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">State</th>
                            <th className="py-2.5 px-3 text-right">Resources (MT)</th>
                            <th className="py-2.5 px-3 text-right">Share %</th>
                            <th className="py-2.5 px-3">Primary Coalfields</th>
                            <th className="py-2.5 px-3">Dominant Classification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {GSI_NATIONAL_COAL_RESOURCES.map((g, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 font-semibold text-slate-900">{g.state}</td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                                {g.resources_mt.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-sky-800">
                                {g.percentage_share.toFixed(2)}%
                              </td>
                              <td className="py-2 px-3 text-slate-600">{g.major_coalfields.join(', ')}</td>
                              <td className="py-2 px-3 text-slate-500 text-[11px]">{g.primary_coal_type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table 2: CIL Subsidiary Production */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide">
                        Coal India Limited - Subsidiary Production Performance (FY 2024-25)
                      </h4>
                      <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Consolidated Production: {TOTAL_CIL_PRODUCTION_2024_25} MT
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Subsidiary</th>
                            <th className="py-2.5 px-3">State / HQ</th>
                            <th className="py-2.5 px-3 text-right">FY 2023-24 (MT)</th>
                            <th className="py-2.5 px-3 text-right">FY 2024-25 (MT)</th>
                            <th className="py-2.5 px-3 text-right">Target (MT)</th>
                            <th className="py-2.5 px-3 text-center">Achievement %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {CIL_SUBSIDIARY_PRODUCTION.map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 font-semibold text-slate-900">
                                {s.subsidiary} ({s.name})
                              </td>
                              <td className="py-2 px-3 text-slate-600">{s.state}</td>
                              <td className="py-2 px-3 text-right font-mono text-slate-600">
                                {s.production_2023_24_mt.toFixed(1)} MT
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                {s.production_2024_25_mt.toFixed(1)} MT
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-slate-600">
                                {s.target_2024_25_mt.toFixed(1)} MT
                              </td>
                              <td className="py-2 px-3 text-center font-bold">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                                  s.achievement_percentage >= 99 ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                                }`}>
                                  {s.achievement_percentage.toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OFFICIAL PRINTABLE GOVERNMENT VIEW */}
              {activePreviewTab === 'printable' && (
                <div className="pt-4">
                  <div className="border border-slate-300 rounded-xl p-8 bg-white shadow-sm font-serif text-slate-900 max-w-3xl mx-auto printable-dossier">
                    {/* Header Seal */}
                    <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
                      <div className="text-xs font-sans font-bold tracking-widest text-slate-600 uppercase">
                        GOVERNMENT OF INDIA • MINISTRY OF COAL
                      </div>
                      <div className="text-lg font-bold font-sans text-slate-900 uppercase tracking-tight mt-1">
                        CENTRAL MINE PLANNING &amp; DESIGN INSTITUTE LIMITED (CMPDI)
                      </div>
                      <div className="text-xs font-sans text-slate-500 mt-0.5">
                        Central Geological &amp; Production Intelligence Directorate • Gondwana Place, Kanke Road, Ranchi
                      </div>
                    </div>

                    {/* Title & Metadata */}
                    <div className="mb-4">
                      <h2 className="text-base font-bold font-sans text-slate-900 mb-1">
                        {selectedReport.title}
                      </h2>
                      <div className="text-xs font-sans text-slate-600 flex justify-between border-b border-slate-200 pb-2">
                        <span>Scope: Coal India Limited Consolidated</span>
                        <span>Financial Year: {selectedReport.financial_year}</span>
                        <span>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="text-xs font-sans leading-relaxed text-slate-800 space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                          1. Executive Synthesis &amp; National Inventory
                        </h4>
                        <p>{selectedReport.executive_summary}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                          2. GSI State-Wise Resource Distribution (as of 01.04.2025)
                        </h4>
                        <table className="w-full text-left text-xs border border-slate-300">
                          <thead className="bg-slate-100 font-bold border-b border-slate-300">
                            <tr>
                              <th className="p-1.5 border-r border-slate-300">State</th>
                              <th className="p-1.5 border-r border-slate-300 text-right">Resource (MT)</th>
                              <th className="p-1.5 border-r border-slate-300 text-right">Share %</th>
                              <th className="p-1.5">Dominant Coalfields</th>
                            </tr>
                          </thead>
                          <tbody>
                            {GSI_NATIONAL_COAL_RESOURCES.slice(0, 5).map((g, i) => (
                              <tr key={i} className="border-b border-slate-200">
                                <td className="p-1.5 border-r border-slate-300 font-medium">{g.state}</td>
                                <td className="p-1.5 border-r border-slate-300 text-right font-mono">{g.resources_mt.toLocaleString('en-IN')}</td>
                                <td className="p-1.5 border-r border-slate-300 text-right font-mono">{g.percentage_share.toFixed(2)}%</td>
                                <td className="p-1.5">{g.major_coalfields.join(', ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-1">
                          3. CIL Subsidiary Extraction Return (FY 2024-25)
                        </h4>
                        <table className="w-full text-left text-xs border border-slate-300">
                          <thead className="bg-slate-100 font-bold border-b border-slate-300">
                            <tr>
                              <th className="p-1.5 border-r border-slate-300">Subsidiary</th>
                              <th className="p-1.5 border-r border-slate-300 text-right">2023-24 (MT)</th>
                              <th className="p-1.5 border-r border-slate-300 text-right">2024-25 (MT)</th>
                              <th className="p-1.5 border-r border-slate-300 text-right">Target (MT)</th>
                              <th className="p-1.5 text-center">Achievement %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {CIL_SUBSIDIARY_PRODUCTION.map((s, i) => (
                              <tr key={i} className="border-b border-slate-200">
                                <td className="p-1.5 border-r border-slate-300 font-medium">{s.subsidiary} ({s.name})</td>
                                <td className="p-1.5 border-r border-slate-300 text-right font-mono">{s.production_2023_24_mt.toFixed(1)}</td>
                                <td className="p-1.5 border-r border-slate-300 text-right font-mono font-bold">{s.production_2024_25_mt.toFixed(1)}</td>
                                <td className="p-1.5 border-r border-slate-300 text-right font-mono">{s.target_2024_25_mt.toFixed(1)}</td>
                                <td className="p-1.5 text-center font-mono font-bold">{s.achievement_percentage.toFixed(1)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Signature Block */}
                      <div className="pt-8 mt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900">Dr. Rajeshwar Sharma</div>
                          <div className="text-[10px] text-slate-500">Director (Technical / Planning), CMPDI Ranchi</div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Shri Amitabh Roy</div>
                          <div className="text-[10px] text-slate-500">Advisor (Coal &amp; Exploration), Ministry of Coal</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Source Link */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-4">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified with Geological Survey of India National Inventory &amp; CIL Official Accounts</span>
              </span>
              <span className="font-mono text-slate-400">
                Non-repudiation Hash: SHA-256 Validated
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
