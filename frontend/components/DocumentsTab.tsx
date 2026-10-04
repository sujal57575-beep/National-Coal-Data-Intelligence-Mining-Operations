'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Eye,
  Download,
  Building2,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  fetchDocuments,
  fetchSubsidiaries,
  uploadDocument,
  DocumentItem,
  SubsidiaryItem
} from '../services/api';

interface DocumentsTabProps {
  onSelectDocumentForExtraction: (docId: string) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ onSelectDocumentForExtraction }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Upload Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('Geological Report');
  const [uploadSubsidiary, setUploadSubsidiary] = useState('sub-ccl');
  const [uploadDepartment, setUploadDepartment] = useState('Geology & Exploration');
  const [uploadYear, setUploadYear] = useState('2024-25');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = [
    'ALL',
    'Geological Report',
    'Mining Report',
    'Production Report',
    'Exploration Report',
    'Safety Report',
    'Environmental Report'
  ];

  const statuses = ['ALL', 'VALIDATED', 'VALIDATION_REQUIRED', 'PROCESSING'];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [docs, subs] = await Promise.all([
        fetchDocuments(),
        fetchSubsidiaries()
      ]);
      setDocuments(docs);
      setSubsidiaries(subs);
    } catch (e) {
      console.error('Failed to load documents:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadSuccess) {
      alert('Please select a file to ingest.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('file', selectedFile);
      formData.append('document_category', uploadCategory);
      formData.append('subsidiary_id', uploadSubsidiary);
      formData.append('department', uploadDepartment);
      formData.append('financial_year', uploadYear);

      const newDoc = await uploadDocument(formData);
      setUploadSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadSuccess(false);
        loadData();
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.subsidiary_name && doc.subsidiary_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.mine_name && doc.mine_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || doc.document_category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'ALL' || doc.processing_status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Upload Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Document Ingestion & OCR Processing Hub
            </h2>
            <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-200 font-mono">
              {documents.length} Indexed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise multi-modal pipeline ingesting scanned borehole cores, monthly extraction registers, and PDF reports
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh documents"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Geological / Mining Document</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by file name, subsidiary (CCL, SECL), or mine (Rajrappa, Gevra)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Document / File</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Subsidiary / Mine</th>
                <th className="py-3.5 px-4">Upload Date</th>
                <th className="py-3.5 px-4 text-center">Confidence</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No documents matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isSuccess = doc.processing_status === 'VALIDATED';
                  const isReviewNeeded = doc.processing_status === 'VALIDATION_REQUIRED';

                  return (
                    <tr key={doc.document_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100 font-bold text-[10px]">
                            {doc.file_type}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 truncate max-w-xs hover:text-sky-600 transition-colors">
                              {doc.file_name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {(doc.file_size / (1024 * 1024)).toFixed(2)} MB • {doc.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-full font-medium border border-slate-200">
                          {doc.document_category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold">{doc.subsidiary_name || 'CIL'}</div>
                        <div className="text-[11px] text-slate-400">{doc.mine_name || 'Regional Field'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(doc.upload_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-1 font-mono font-bold text-[11px] text-slate-700">
                          <span>{Math.round(doc.confidence_score * 100)}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isSuccess
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isReviewNeeded
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}
                        >
                          {isSuccess && <CheckCircle2 className="w-3 h-3" />}
                          {isReviewNeeded && <AlertTriangle className="w-3 h-3" />}
                          <span>{doc.processing_status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectDocumentForExtraction(doc.document_id)}
                          className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs px-3 py-1.5 rounded-lg border border-sky-200 inline-flex items-center space-x-1.5 transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5 text-sky-600" />
                          <span>Review Extractions</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ingest Mining & Geological Document
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    OCR extraction, tabular normalization, and vector embedding
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4 mt-4 text-xs">
              {/* File Dropzone */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload File (PDF, DOCX, XLSX, TIFF)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-xl p-5 text-center bg-slate-50/50 cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <FileText className="w-8 h-8 text-sky-500" />
                    <span className="font-semibold text-slate-700">
                      {selectedFile ? selectedFile.name : 'Click or drag document here to upload'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Supports geological borehole logs, mine returns & survey PDFs up to 50MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="Geological Report">Geological Report (Lithology & Seam)</option>
                  <option value="Mining Report">Mining Report (DPR & Mine Plan)</option>
                  <option value="Production Report">Production Report (Monthly Extraction Returns)</option>
                  <option value="Exploration Report">Exploration Report (Core Drilling Logs)</option>
                  <option value="Safety Report">Safety Report (DGMS Audit & Strata)</option>
                  <option value="Environmental Report">Environmental Report (Eco Restoration)</option>
                </select>
              </div>

              {/* Subsidiary */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subsidiary</label>
                  <select
                    value={uploadSubsidiary}
                    onChange={(e) => setUploadSubsidiary(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    {subsidiaries.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name.substring(0, 18)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={uploadDepartment}
                    onChange={(e) => setUploadDepartment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="Geology & Exploration">Geology & Exploration</option>
                    <option value="Mining Operations">Mining Operations</option>
                    <option value="Production & Planning">Production & Planning</option>
                    <option value="Safety & Rescue">Safety & Rescue</option>
                    <option value="Environment & Forestry">Environment & Forestry</option>
                  </select>
                </div>
              </div>

              {/* Financial Year */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Financial Year</label>
                <input
                  type="text"
                  value={uploadYear}
                  onChange={(e) => setUploadYear(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing OCR & Vectors...</span>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Ingestion Complete!</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Begin Ingestion Pipeline</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
