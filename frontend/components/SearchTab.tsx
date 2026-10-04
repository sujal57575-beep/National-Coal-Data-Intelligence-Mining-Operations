'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { hybridSearch, fetchSubsidiaries, SubsidiaryItem } from '../services/api';

interface SearchTabProps {
  onSelectDocForReview: (docId: string) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ onSelectDocForReview }) => {
  const [query, setQuery] = useState('Rajrappa coal production overburden');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<string>('ALL');
  const [results, setResults] = useState<any[]>([]);
  const [executionTime, setExecutionTime] = useState<number>(14.8);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryItem[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const subs = await fetchSubsidiaries();
        setSubsidiaries(subs);
        runSearch('Rajrappa coal production overburden');
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  const runSearch = async (qString?: string) => {
    const q = (qString !== undefined ? qString : query).trim();
    if (!q) return;

    setIsSearching(true);
    try {
      const resp = await hybridSearch(q, selectedCategory !== 'ALL' ? selectedCategory : undefined);
      setResults(resp.results || []);
      setExecutionTime(resp.execution_time_ms || 12.4);
      setTotalFound(resp.total_results || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Hybrid Multi-Modal Search Engine
            </h2>
            <p className="text-xs text-slate-500">
              Dense vector embeddings (BGE-M3) combined with BM25 lexical keyword matching
            </p>
          </div>
        </div>

        {/* Search Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
          className="flex items-center space-x-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search across millions of tons of reserves, boreholes, stripping ratios, HEMM machinery..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 shrink-0 disabled:opacity-50"
          >
            {isSearching ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Execute Search</span>
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setTimeout(() => runSearch(), 50);
              }}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="Geological Report">Geological Reports</option>
              <option value="Mining Report">Mining Reports</option>
              <option value="Production Report">Production Reports</option>
              <option value="Safety Report">Safety Reports</option>
              <option value="Environmental Report">Environmental Reports</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-500">Subsidiary:</span>
            <select
              value={selectedSubsidiary}
              onChange={(e) => {
                setSelectedSubsidiary(e.target.value);
                setTimeout(() => runSearch(), 50);
              }}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All CIL Subsidiaries</option>
              {subsidiaries.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.code} - {s.name.substring(0, 20)}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
            <span>Search time: {executionTime} ms</span>
            <span>•</span>
            <span>{totalFound} results found</span>
          </div>
        </div>
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            No matching geological records found for the query.
          </div>
        ) : (
          results.map((res, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                      RANK #{index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors">
                      {res.file_name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {res.document_category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Score: {(res.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-500 mb-3">
                  <span className="font-semibold text-slate-700">{res.subsidiary}</span>
                  <span>•</span>
                  <span>{res.mine}</span>
                  <span>•</span>
                  <span className="font-mono">Page {res.page_number}</span>
                </div>

                {/* Highlighted Evidence Snippet */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans mb-3">
                  <span className="font-semibold text-slate-900">Extracted Snippet: </span>
                  &ldquo;{res.snippet}&rdquo;
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 font-mono">
                  Spatial Box: x:{res.bounding_box?.x} y:{res.bounding_box?.y} w:{res.bounding_box?.w} h:{res.bounding_box?.h}
                </div>

                <button
                  onClick={() => onSelectDocForReview(res.document_id)}
                  className="bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-sky-200 inline-flex items-center space-x-1 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Inspect in Studio</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
