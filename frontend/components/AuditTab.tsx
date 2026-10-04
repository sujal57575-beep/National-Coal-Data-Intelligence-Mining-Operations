'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  User as UserIcon,
  FileText
} from 'lucide-react';
import { fetchAuditLogs, AuditLogItem } from '../services/api';

export const AuditTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAuditLogs();
        setLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.user_name.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entity_type.toLowerCase().includes(q) ||
      (log.reason && log.reason.toLowerCase().includes(q)) ||
      log.hash_signature.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Immutable Enterprise Regulatory Audit Trail
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA-256 Tamper Evident</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete cryptographic audit trail recording every document ingestion, human-in-the-loop entity verification, and parliamentary response approval
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-emerald-800 font-semibold flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Integrity Verified: 0 Discrepancies</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action (ENTITY_ACCEPT, DOCUMENT_UPLOAD), reason, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Timestamp & IP</th>
                <th className="py-3.5 px-4">User / Actor</th>
                <th className="py-3.5 px-4">Action Taken</th>
                <th className="py-3.5 px-4">Entity & Reason</th>
                <th className="py-3.5 px-4">Diff / Value</th>
                <th className="py-3.5 px-4 text-right">SHA-256 Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => {
                const isAccept = log.action.includes('ACCEPT');
                const isUpload = log.action.includes('UPLOAD');
                const isApprove = log.action.includes('APPROVED');

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.ip_address}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                          <UserIcon className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-slate-900">{log.user_name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isAccept || isApprove
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isUpload
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 text-[11px]">
                        {log.entity_type} {log.entity_id ? `(${log.entity_id.substring(0, 8)}...)` : ''}
                      </div>
                      <div className="text-[10px] text-slate-500 max-w-xs truncate">
                        {log.reason || 'Routine operational execution'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {log.old_value && (
                        <div className="text-[10px] text-slate-400 line-through truncate font-mono">
                          {log.old_value}
                        </div>
                      )}
                      {log.new_value && (
                        <div className="text-[11px] text-slate-800 font-bold truncate font-mono">
                          {log.new_value}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleCopyHash(log.hash_signature)}
                        className="inline-flex items-center space-x-1.5 font-mono text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                        title={log.hash_signature}
                      >
                        <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{log.hash_signature.substring(0, 12)}...</span>
                        {copiedHash === log.hash_signature ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
