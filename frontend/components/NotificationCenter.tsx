'use client';

import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2, Info, Zap, FileWarning, Clock, X, ChevronRight, Filter } from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning' | 'ai';
  title: string;
  body: string;
  time: string;
  module: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'alert',   title: 'DGMS Inspection Due — CCL Kathara', body: 'Statutory 3-monthly inspection overdue by 4 days. Schedule immediately.', time: '2 min ago', module: 'Safety', read: false },
  { id: 'n2', type: 'warning', title: 'Production Variance Detected — NCL Jayant', body: 'Monthly output fell 8.4% below target. OCR extraction flagged for review.', time: '18 min ago', module: 'Dashboard', read: false },
  { id: 'n3', type: 'ai',      title: 'AI Copilot — PQ Draft Ready', body: 'Parliamentary Query PQ-2024-0198 auto-draft completed. Awaiting sign-off.', time: '1 hr ago', module: 'Parliamentary', read: false },
  { id: 'n4', type: 'info',    title: 'New Document Ingested', body: '12 new borehole logs (SECL FY24) processed with 97.1% OCR confidence.', time: '2 hr ago', module: 'Documents', read: true },
  { id: 'n5', type: 'success', title: 'Report Generated Successfully', body: 'Q2 FY2024-25 Quarterly Briefing exported as PDF + DOCX for CMPDI HQ.', time: '3 hr ago', module: 'Reports', read: true },
  { id: 'n6', type: 'alert',   title: 'NCR Outstanding — BCCL Dhanbad', body: 'Non-Conformance Report NCR-2024-0041 approaching 30-day resolution deadline.', time: '5 hr ago', module: 'Safety', read: true },
  { id: 'n7', type: 'info',    title: 'World Bank Data Refreshed', body: 'Coal electricity share indicator updated: India at 76.1% (2024 estimate).', time: '1 day ago', module: 'Dashboard', read: true },
  { id: 'n8', type: 'success', title: 'Extraction Review Completed', body: '23 entities in Gevra OC borehole log accepted. Audit record committed.', time: '1 day ago', module: 'Extraction', read: true },
];

const typeIcon: Record<string, React.ElementType> = {
  alert: AlertTriangle, info: Info, success: CheckCircle2, warning: FileWarning, ai: Zap,
};
const typeColor: Record<string, string> = {
  alert:   'bg-rose-100 text-rose-700 border-rose-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  info:    'bg-cyan-100 text-cyan-700 border-cyan-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ai:      'bg-violet-100 text-violet-700 border-violet-200',
};
const dotColor: Record<string, string> = {
  alert: 'bg-rose-500', warning: 'bg-amber-500', info: 'bg-cyan-500', success: 'bg-emerald-500', ai: 'bg-violet-500',
};

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

const moduleToTab: Record<string, string> = {
  Safety: 'safety', Dashboard: 'dashboard', Parliamentary: 'parliamentary',
  Documents: 'documents', Reports: 'reports', Extraction: 'extraction',
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onNavigate }) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'alert' | 'ai'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const dismiss = (id: string) => setNotifications(n => n.filter(x => x.id !== id));
  const markRead = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'alert')  return n.type === 'alert' || n.type === 'warning';
    if (filter === 'ai')     return n.type === 'ai';
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-96 max-h-[80vh] flex flex-col glass-card rounded-2xl shadow-2xl animate-scale-in overflow-hidden border border-slate-200/60">
        {/* Header */}
        <div className="p-4 border-b border-slate-100/60 flex items-center justify-between bg-white/80">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="font-extrabold text-sm text-slate-900">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] text-emerald-700 font-semibold hover:underline">Mark all read</button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-2 gap-1 border-b border-slate-100/60 bg-slate-50/50">
          {(['all', 'unread', 'alert', 'ai'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">No notifications in this category</div>
          )}
          {filtered.map(notif => {
            const Icon = typeIcon[notif.type] || Info;
            return (
              <div key={notif.id}
                className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${notif.read ? 'bg-white/60 border-slate-200/60' : 'bg-white border-slate-300/60 shadow-sm'}`}
                onClick={() => { markRead(notif.id); onNavigate(moduleToTab[notif.module] || 'dashboard'); onClose(); }}>
                <div className="flex items-start space-x-3">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${typeColor[notif.type]}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className={`text-[11px] font-bold leading-snug ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</div>
                      {!notif.read && <span className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${dotColor[notif.type]}`} />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[9px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" /><span>{notif.time}</span>
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${typeColor[notif.type]}`}>{notif.module}</span>
                    </div>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-100 rounded transition-all">
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const useNotificationCount = () => INITIAL_NOTIFICATIONS.filter(n => !n.read).length;
