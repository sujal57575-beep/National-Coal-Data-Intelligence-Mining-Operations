'use client';

import React from 'react';
import { Landmark, CheckCircle, Info, ExternalLink, Activity, Layers, Code, Zap } from 'lucide-react';

export const AboutTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-dark-mesh rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="absolute right-0 top-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/15 text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-400/20 mb-4 font-bold">
            <Landmark className="w-4 h-4 text-indigo-300" />
            <span className="tracking-wide text-[11px]">SMART INDIA HACKATHON 2026</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Problem Statement: <span className="text-indigo-400">SIH26023</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mt-4">
            AI-Powered Geological, Mining and other Reporting Solution for CMPDI/CIL subsidiaries. Developed for the Ministry of Coal, Government of India.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Info className="w-5 h-5 text-indigo-500 mr-2" /> Context & Objective
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              The Ministry of Coal aims to leverage Artificial Intelligence, advanced data analytics, and smart automation to enhance operational efficiency, safety, and governance within the Indian coal mining sector. 
              The Central Mine Planning & Design Institute (CMPDI) acts as the nodal agency for this initiative.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our unified AI platform digitizes and processes massive volumes of unstructured geological exploration dossiers, borehole lithology logs, and DGMS compliance reports. It uses highly accurate OCR and RAG models to reduce manual data-entry time, flags operational anomalies in coal production, and synthesizes automated parliamentary question responses with full auditability.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 text-emerald-500 mr-2" /> Key Features & Innovations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Dual Hybrid OCR', desc: 'PaddleOCR-v4 + Tesseract for precise extraction.' },
                { title: 'Grounded RAG Copilot', desc: 'Zero-hallucination Conversational AI.' },
                { title: 'Immutable Audit Trail', desc: 'SHA-256 signatures for regulatory compliance.' },
                { title: 'Multi-Modal Search', desc: 'Sub-15ms semantic dense vector search.' },
                { title: 'GIS Heatmap & Boreholes', desc: 'Interactive real-time map visualization.' },
                { title: 'AI Predictive Forecasting', desc: 'Target vs Output trend predictions.' }
              ].map((feat, idx) => (
                <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-sm text-slate-800 mb-1">{feat.title}</h4>
                  <p className="text-xs text-slate-500">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-white">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Project Metadata</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                <span className="text-slate-500">PS ID</span>
                <span className="font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">SIH26023</span>
              </div>
              <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-800">Software</span>
              </div>
              <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
                <span className="text-slate-500">Ministry</span>
                <span className="font-semibold text-slate-800">Ministry of Coal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Organization</span>
                <span className="font-semibold text-slate-800">CMPDI / CIL</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
              <Layers className="w-4 h-4 text-blue-500 mr-2"/> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Next.js 14', 'React', 'Tailwind', 'FastAPI', 'Python 3', 'PaddleOCR', 'SQLite', 'Leaflet', 'Recharts'].map(tech => (
                <span key={tech} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
