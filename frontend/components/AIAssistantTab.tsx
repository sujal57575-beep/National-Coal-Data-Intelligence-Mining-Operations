'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { askAIAssistant } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  confidence?: number;
  policy?: string;
  sources?: Array<{
    document_id: string;
    document_name: string;
    subsidiary: string;
    page_number: number;
    snippet: string;
    confidence: number;
    bounding_box?: any;
  }>;
  timestamp: string;
}

export const AIAssistantTab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Greetings. I am the CMPDI AI Data Intelligence Copilot. I analyze geological exploration reports, borehole lithology logs, statutory mine plans, and production returns across all Coal India subsidiaries. Every assertion is strictly grounded with verifiable document citations.',
      confidence: 1.0,
      policy: 'LOCAL_ONLY',
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [governancePolicy, setGovernancePolicy] = useState('LOCAL_ONLY');
  const [isThinking, setIsThinking] = useState(false);

  const samplePrompts = [
    'What is the proved geological reserve and stripping ratio at Rajrappa Block?',
    'Summarize Gevra Mega Opencast expansion target and surface miner deployment.',
    'What methane drainage measures are in place for Moonidih underground mine?',
    'What was Coal India total coal dispatch to thermal power stations in Q3?'
  ];

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isThinking) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await askAIAssistant(q, governancePolicy);
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        confidence: response.confidence,
        policy: response.governance_policy_applied,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'An error occurred during vector retrieval. Please verify on-premise AI service connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Copilot Header & Governance Controller */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                CMPDI Grounded Intelligence Copilot (RAG v2.4)
              </h2>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                ZERO-HALLUCINATION POLICY
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Retrieval-Augmented Generation strictly anchored to verified CMPDI / CIL document archives
            </p>
          </div>
        </div>

        {/* Data Governance Selector */}
        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Governance:</span>
          <select
            value={governancePolicy}
            onChange={(e) => setGovernancePolicy(e.target.value)}
            className="p-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="LOCAL_ONLY">LOCAL_ONLY (Air-Gapped On-Prem)</option>
            <option value="HYBRID_CLOUD">HYBRID_CLOUD (Gov Cloud Encrypted)</option>
            <option value="AIR_GAPPED">AIR_GAPPED (Classified Deep Mining)</option>
          </select>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-[560px]">
        {/* Messages List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1.5 px-1">
                  <span className="text-[11px] font-bold text-slate-400">
                    {isUser ? 'MINING ANALYST (YOU)' : 'CMPDI INTELLIGENCE NODE'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-3xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-sky-600 text-white font-medium shadow-xs rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-xs rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Verification & Sources Panel (Only for Assistant) */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Grounded Document Evidence ({msg.sources.length} sources)</span>
                        </span>
                        <span className="font-mono text-slate-500 font-bold">
                          Confidence: {Math.round((msg.confidence || 0.95) * 100)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {msg.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sky-800 truncate text-[11px]">
                                {src.document_name}
                              </span>
                              <span className="font-mono text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded font-bold shrink-0">
                                Page {src.page_number}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium mb-1">
                              {src.subsidiary}
                            </div>
                            <div className="text-[11px] text-slate-600 italic border-l-2 border-sky-400 pl-2 mt-1 line-clamp-2">
                              &ldquo;{src.snippet}&rdquo;
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center space-x-1 pt-1">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>Execution strictly bounded by {msg.policy || 'LOCAL_ONLY'} policy. Zero external LLM egress.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2 mb-1.5 px-1">
                <span className="text-[11px] font-bold text-slate-400">CMPDI INTELLIGENCE NODE</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs flex items-center space-x-3 text-slate-600">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>Executing vector search across 109 geological dossiers & borehole logs...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts Bar */}
        <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Suggestions:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 px-3 py-1 rounded-full border border-slate-200 whitespace-nowrap transition-colors font-medium shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              placeholder="Query geological coal reserves, stripping ratios, GCV grades, DGMS safety records..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Query Assistant</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
