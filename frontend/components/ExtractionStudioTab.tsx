'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building2,
  Sparkles,
  Download,
  Eye,
  ShieldCheck,
  Table as TableIcon
} from 'lucide-react';
import {
  fetchDocuments,
  fetchDocumentExtractions,
  correctEntity,
  DocumentItem,
  ExtractedEntity,
  ExtractedTableData
} from '../services/api';

interface ExtractionStudioTabProps {
  selectedDocId?: string;
  onSelectDocId?: (id: string) => void;
}

export const ExtractionStudioTab: React.FC<ExtractionStudioTabProps> = ({
  selectedDocId = 'doc-001',
  onSelectDocId
}) => {
  const [currentDocId, setCurrentDocId] = useState(selectedDocId);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [extractions, setExtractions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRightTab, setActiveRightTab] = useState<'entities' | 'tables' | 'ocr'>('entities');
  
  // Highlighted entity bounding box
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);

  // Edit Modal / Inline State
  const [editingEntity, setEditingEntity] = useState<ExtractedEntity | null>(null);
  const [correctedValue, setCorrectedValue] = useState('');
  const [correctedUnit, setCorrectedUnit] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  useEffect(() => {
    loadExtractions(currentDocId);
  }, [currentDocId]);

  async function loadExtractions(docId: string) {
    setLoading(true);
    try {
      const data = await fetchDocumentExtractions(docId);
      setExtractions(data);
      setCurrentPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleDocumentChange = (id: string) => {
    setCurrentDocId(id);
    if (onSelectDocId) onSelectDocId(id);
  };

  const handleAction = async (entity: ExtractedEntity, action: 'ACCEPT' | 'REJECT') => {
    try {
      await correctEntity({
        entity_id: entity.id,
        corrected_value: entity.normalized_value,
        action: action,
        unit: entity.unit,
        notes: `Reviewer verified entity: ${action}`
      });
      loadExtractions(currentDocId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCorrection = async () => {
    if (!editingEntity) return;
    setIsSubmitting(true);
    try {
      await correctEntity({
        entity_id: editingEntity.id,
        corrected_value: correctedValue,
        action: 'EDIT',
        unit: correctedUnit,
        notes: editNotes || 'Expert human correction'
      });
      setEditingEntity(null);
      loadExtractions(currentDocId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeDoc = documents.find((d) => d.document_id === currentDocId) || documents[0];
  const entities: ExtractedEntity[] = extractions?.entities || [];
  const tables: ExtractedTableData[] = extractions?.tables || [];
  const pages = extractions?.pages || [];
  const currentPageData = pages.find((p: any) => p.page_number === currentPage) || pages[0];

  return (
    <div className="space-y-4">
      {/* Studio Header & Document Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Split-Screen Extraction Studio & Verification Workbench
            </h2>
            <p className="text-xs text-slate-500">
              Interactive human-in-the-loop validation with spatial bounding box anchoring
            </p>
          </div>
        </div>

        {/* Document Selector */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Active Document:</span>
          <select
            value={currentDocId}
            onChange={(e) => handleDocumentChange(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 max-w-sm truncate"
          >
            {documents.map((d) => (
              <option key={d.document_id} value={d.document_id}>
                {d.file_name} ({d.subsidiary_name || 'CIL'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Split Screen Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
        {/* LEFT COLUMN (6 of 12 cols): Interactive Document / OCR Canvas */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Document Viewer Toolbar */}
          <div className="bg-slate-900 text-slate-200 px-4 py-3 flex items-center justify-between text-xs border-b border-slate-800">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-semibold text-slate-100 truncate">
                {activeDoc?.file_name}
              </span>
            </div>

            {/* Page Navigator */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-slate-300">
                Page {currentPage} of {pages.length || 1}
              </span>
              <button
                disabled={currentPage >= (pages.length || 1)}
                onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Sheet Simulation */}
          <div className="p-6 bg-slate-100 flex-1 overflow-y-auto relative flex justify-center">
            <div className="bg-white border border-slate-300 shadow-md rounded-lg w-full max-w-lg min-h-[580px] p-6 relative font-serif text-slate-800 select-none">
              {/* Document Header Watermark */}
              <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
                <div className="text-[10px] font-sans font-bold tracking-widest text-slate-500 uppercase">
                  CENTRAL MINE PLANNING & DESIGN INSTITUTE LIMITED
                </div>
                <div className="text-sm font-bold font-sans text-slate-900 uppercase tracking-tight mt-0.5">
                  GEOLOGICAL & EXTRACTION INTELLIGENCE DOSSIER
                </div>
                <div className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Ref: CMPDI/GEO/2024-25/BLK-C • Subsidiary: {activeDoc?.subsidiary_name}
                </div>
              </div>

              {/* Dynamic Page Content with Highlight Overlays */}
              <div className="text-xs leading-relaxed whitespace-pre-line text-slate-700 font-sans">
                {currentPageData?.text || 'Loading document text contents...'}
              </div>

              {/* Visual Bounding Boxes Anchored on Canvas */}
              {entities
                .filter((e) => e.page_number === currentPage)
                .map((ent) => {
                  const isHovered = hoveredEntityId === ent.id;
                  const isPending = ent.validation_status === 'PENDING';
                  return (
                    <div
                      key={ent.id}
                      onMouseEnter={() => setHoveredEntityId(ent.id)}
                      onMouseLeave={() => setHoveredEntityId(null)}
                      className={`absolute rounded transition-all cursor-pointer border-2 ${
                        isHovered
                          ? 'bg-amber-300/30 border-amber-600 ring-2 ring-amber-400 ring-opacity-50 z-20'
                          : isPending
                          ? 'bg-amber-100/20 border-amber-500/60 z-10'
                          : 'bg-emerald-100/20 border-emerald-500/60 z-10'
                      }`}
                      style={{
                        top: `${ent.bounding_box_json?.y || 120}px`,
                        left: `${ent.bounding_box_json?.x || 60}px`,
                        width: `${ent.bounding_box_json?.w || 280}px`,
                        height: `${ent.bounding_box_json?.h || 40}px`
                      }}
                    >
                      <span className="absolute -top-3 left-1 bg-slate-900 text-white text-[9px] px-1 rounded font-mono font-bold tracking-tight shadow-xs">
                        {ent.entity_type} ({Math.round(ent.extraction_confidence * 100)}%)
                      </span>
                    </div>
                  );
                })}

              {/* Document Footer */}
              <div className="absolute bottom-4 left-6 right-6 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-sans text-slate-400">
                <span>CMPDI CONFIDENTIAL MINING DATA</span>
                <span>PAGE {currentPage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (6 of 12 cols): Extraction & Verification Panel */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Tabs for Right Column */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-2 bg-slate-50/50">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveRightTab('entities')}
                className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
                  activeRightTab === 'entities'
                    ? 'border-sky-600 text-sky-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Extracted Entities ({entities.length})</span>
              </button>

              <button
                onClick={() => setActiveRightTab('tables')}
                className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
                  activeRightTab === 'tables'
                    ? 'border-sky-600 text-sky-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>Extracted Tables ({tables.length})</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium pb-2">
              Human-in-the-Loop Active
            </div>
          </div>

          {/* Tab 1: Extracted Entities List */}
          {activeRightTab === 'entities' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              <div className="text-xs text-slate-500 bg-sky-50 border border-sky-100 p-2.5 rounded-xl flex items-center justify-between">
                <span>
                  Hover over any entity to highlight its verified OCR bounding box in the document viewer.
                </span>
                <span className="text-[11px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                  {entities.filter((e) => e.validation_status === 'ACCEPT').length} / {entities.length} Verified
                </span>
              </div>

              {entities.map((entity) => {
                const isHovered = hoveredEntityId === entity.id;
                const isAccepted = entity.validation_status === 'ACCEPT';
                const isEdited = entity.validation_status === 'EDIT';
                const isPending = entity.validation_status === 'PENDING';

                return (
                  <div
                    key={entity.id}
                    onMouseEnter={() => setHoveredEntityId(entity.id)}
                    onMouseLeave={() => setHoveredEntityId(null)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isHovered
                        ? 'border-sky-500 bg-sky-50/40 shadow-xs ring-1 ring-sky-300'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {entity.entity_type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Page {entity.page_number}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-slate-500">
                          Conf: {Math.round(entity.extraction_confidence * 100)}%
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isEdited
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {entity.validation_status}
                        </span>
                      </div>
                    </div>

                    {/* Value Rows */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Raw OCR Value:</span>
                        <span className="font-mono text-slate-700 font-medium">
                          {entity.raw_value}
                        </span>
                      </div>
                      <div className="bg-sky-50/50 p-2 rounded-lg border border-sky-100">
                        <span className="text-[10px] text-sky-700 block font-semibold">
                          Normalized Value:
                        </span>
                        <span className="font-mono text-slate-900 font-bold text-sm">
                          {entity.normalized_value} {entity.unit}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEditingEntity(entity);
                          setCorrectedValue(entity.normalized_value);
                          setCorrectedUnit(entity.unit || '');
                          setEditNotes('');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>Edit Value</span>
                      </button>

                      <button
                        onClick={() => handleAction(entity, 'REJECT')}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold flex items-center space-x-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleAction(entity, 'ACCEPT')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept & Audit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Extracted Tables */}
          {activeRightTab === 'tables' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{table.table_title}</h4>
                      <p className="text-[10px] text-slate-400">
                        Page {table.page_number} • Extraction Confidence: {Math.round(table.confidence * 100)}%
                      </p>
                    </div>
                    <button
                      onClick={() => alert('Table exported to CSV.')}
                      className="text-xs text-sky-700 font-semibold flex items-center space-x-1 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 hover:bg-sky-100"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold">
                        <tr>
                          {table.headers.map((h, i) => (
                            <th key={i} className="py-2 px-3 border-b border-slate-200">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/80">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 px-3 text-slate-800 font-mono text-[11px]">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Entity Modal */}
      {editingEntity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Human-in-the-Loop Value Correction
                </h3>
              </div>
              <button
                onClick={() => setEditingEntity(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Entity:</div>
                <div className="font-bold text-slate-800">
                  {editingEntity.entity_type} (Page {editingEntity.page_number})
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Raw OCR read: <span className="font-mono font-medium">{editingEntity.raw_value}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corrected Normalized Value:
                </label>
                <input
                  type="text"
                  value={correctedValue}
                  onChange={(e) => setCorrectedValue(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unit of Measurement:
                </label>
                <input
                  type="text"
                  value={correctedUnit}
                  onChange={(e) => setCorrectedUnit(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Audit Review Justification Notes:
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Cross-verified with core box lithology register page 4..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingEntity(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveCorrection}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-sm flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Commit to Audit Log</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
