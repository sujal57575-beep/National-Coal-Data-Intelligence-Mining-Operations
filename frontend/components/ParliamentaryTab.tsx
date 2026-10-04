'use client';

import React, { useState, useEffect } from 'react';
import {
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Edit3,
  Check,
  Download,
  ShieldCheck,
  FileText,
  ChevronRight
} from 'lucide-react';
import {
  fetchParliamentaryQueries,
  updateParliamentaryQuery,
  ParliamentaryQueryItem
} from '../services/api';

export const ParliamentaryTab: React.FC = () => {
  const [queries, setQueries] = useState<ParliamentaryQueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<ParliamentaryQueryItem | null>(null);
  const [editingDraft, setEditingDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadQueries();
  }, []);

  async function loadQueries() {
    setLoading(true);
    try {
      const data = await fetchParliamentaryQueries();
      setQueries(data);
      if (data.length > 0 && !selectedQuery) {
        setSelectedQuery(data[0]);
        setEditingDraft(data[0].ai_draft_response || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = (pq: ParliamentaryQueryItem) => {
    setSelectedQuery(pq);
    setEditingDraft(pq.final_response || pq.ai_draft_response || '');
  };

  const handleApprove = async () => {
    if (!selectedQuery) return;
    setIsUpdating(true);
    try {
      await updateParliamentaryQuery(selectedQuery.id, {
        status: 'APPROVED',
        final_response: editingDraft
      });
      await loadQueries();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Parliamentary Questions (PQ) Grounded Synthesis
            </h2>
            <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
              Ministry of Coal Mandate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official Starred & Unstarred inquiries synthesized by CMPDI AI with multi-source verified citations
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-600 font-medium">
            Active Starred Inquiries: <span className="font-bold text-slate-900">{queries.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List (4 cols) & Right Detail (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Query Cards */}
        <div className="lg:col-span-5 space-y-3">
          {queries.map((q) => {
            const isSelected = selectedQuery?.id === q.id;
            const isApproved = q.status === 'APPROVED';
            return (
              <div
                key={q.id}
                onClick={() => handleSelect(q)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/50 shadow-sm ring-1 ring-sky-300'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    {q.query_no}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {q.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5">
                  {q.title}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {q.query_text}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="flex items-center space-x-1 text-rose-600 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>Starred Notice Priority</span>
                  </span>
                  <span className="font-mono">
                    Conf: {Math.round(q.confidence_score * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Draft Response & Approval Workspace */}
        {selectedQuery && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Question Header */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-sky-800">
                    {selectedQuery.query_no}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedQuery.ministry}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {selectedQuery.title}
                </h3>
                <div className="text-xs text-slate-500 font-medium">
                  Subject: {selectedQuery.subject}
                </div>
              </div>

              {/* Official Question Text */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                <div className="font-semibold text-slate-900 mb-1">Text of Parliamentary Notice:</div>
                <p>{selectedQuery.query_text}</p>
              </div>

              {/* Grounded Evidence Citations */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>AI Grounded Citations & Sources</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedQuery.sources_json.map((src, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-sky-50/60 rounded-lg border border-sky-100 text-xs"
                    >
                      <div className="font-semibold text-sky-900 truncate text-[11px]">
                        {src.document_name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                        <span>Page {src.page}</span>
                        <span className="font-mono font-bold text-emerald-700">
                          {Math.round(src.confidence * 100)}% Match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Draft Response Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Synthesized Official Response (AI Grounded Draft):
                </label>
                <textarea
                  rows={6}
                  value={editingDraft}
                  onChange={(e) => setEditingDraft(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed font-sans resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Approval Workflow Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Executive Sign-Off will commit to immutable audit trail</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => alert('Official Parliamentary Brief Memo downloaded.')}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Memo</span>
                </button>

                <button
                  disabled={isUpdating || selectedQuery.status === 'APPROVED'}
                  onClick={handleApprove}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {selectedQuery.status === 'APPROVED' ? 'Approved & Locked' : 'Sign Off & Approve'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
