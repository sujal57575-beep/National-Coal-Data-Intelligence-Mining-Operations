'use client';

import React, { useState, useEffect } from 'react';
import {
  Tags,
  Sparkles,
  Layers,
  TrendingUp,
  BrainCircuit,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  fetchWordCloud,
  fetchTopics,
  WordCloudItem,
  TopicItem
} from '../services/api';

interface AnalyticsTabProps {
  onSearchTopic?: (term: string) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ onSearchTopic }) => {
  const [wordCloud, setWordCloud] = useState<WordCloudItem[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [wc, top] = await Promise.all([
          fetchWordCloud(),
          fetchTopics()
        ]);
        setWordCloud(wc);
        setTopics(top);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Thematic Topic Modeling & Mining NLP Word Cloud
            </h2>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              Unsupervised LDA + BERTopic
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated discovery of operational patterns across thousands of pages of geological borehole lithology and extraction returns
          </p>
        </div>
      </div>

      {/* Interactive Word Cloud Visualizer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Interactive Geological & Mining Term Frequency Cloud</span>
            </h3>
            <p className="text-xs text-slate-500">
              Click any keyword to inspect matching thematic clusters
            </p>
          </div>
          {selectedWord && (
            <button
              onClick={() => setSelectedWord(null)}
              className="text-xs text-sky-700 font-semibold hover:underline"
            >
              Reset Filter ({selectedWord})
            </button>
          )}
        </div>

        {/* Word Cloud Visual Canvas */}
        <div className="p-8 bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/30 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-center gap-3 min-h-[220px]">
          {wordCloud.map((item, idx) => {
            const isSelected = selectedWord === item.text;
            // Scale font size based on value
            const sizeClass =
              item.value > 80
                ? 'text-xl sm:text-2xl font-black text-sky-900'
                : item.value > 60
                ? 'text-lg sm:text-xl font-bold text-sky-700'
                : item.value > 45
                ? 'text-sm sm:text-base font-semibold text-slate-700'
                : 'text-xs font-medium text-slate-500';

            const bgClass = isSelected
              ? 'bg-sky-600 text-white shadow-md scale-110'
              : 'hover:bg-white/80 hover:shadow-xs hover:scale-105';

            return (
              <button
                key={idx}
                onClick={() => setSelectedWord(item.text)}
                className={`px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${sizeClass} ${bgClass}`}
              >
                <span>{item.text}</span>
                <span className="text-[10px] font-mono ml-1.5 opacity-60">
                  {item.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thematic Topic Clusters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Tags className="w-4 h-4 text-sky-600" />
          <span>Extracted Thematic Mining Clusters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((top) => {
            return (
              <div
                key={top.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      CLUSTER #{top.cluster_id}
                    </span>
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      Frequency: {top.frequency}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-2">
                    {top.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {top.description}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Core Semantic Keywords:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {top.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="bg-white text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-200 shadow-2xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
