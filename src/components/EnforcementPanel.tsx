import React, { useState } from 'react';
import { EnforcementNotice, CitySummary } from '../types';
import { Shield, FileText, AlertOctagon, CheckCircle2, Download, ExternalLink, PlusCircle, Scale, Clock, MapPin, Printer } from 'lucide-react';

interface EnforcementPanelProps {
  city: CitySummary;
  notices: EnforcementNotice[];
  onGenerateNewNotice: (noticeData: any) => Promise<void>;
  isGenerating: boolean;
}

export const EnforcementPanel: React.FC<EnforcementPanelProps> = ({
  city,
  notices,
  onGenerateNewNotice,
  isGenerating,
}) => {
  const [selectedNotice, setSelectedNotice] = useState<EnforcementNotice | null>(notices[0] || null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [printableModal, setPrintableModal] = useState<boolean>(false);

  // Form states for creating new notice
  const [violatorName, setViolatorName] = useState<string>('M/s Apex Infrastructure Projects Site');
  const [violatorType, setViolatorType] = useState<'Construction Site' | 'Industrial Stack' | 'Open Waste Burning'>('Construction Site');
  const [location, setLocation] = useState<string>('Anand Vihar Sector 3 Plot 18');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [violationDetails, setViolationDetails] = useState<string>('Uncovered dusty debris, non-operational anti-smog gun during peak PM2.5 period');

  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerateNewNotice({
      violatorName,
      violatorType,
      location,
      city: city.name,
      severity,
      violationDetails,
    });
    setShowModal(false);
  };

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">CPCB Legal Enforcement Action Center</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 font-bold flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 inline" />
              <span>RAG Regulatory Engine</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Station-backed regulatory notice generator for {city.name}. Drafted under Air Act 1981 & GRAP directives.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-lg shadow-red-900/40"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Generate CPCB Regulatory Notice</span>
        </button>
      </div>

      {/* Main Grid: Active Notices List vs Detailed Notice Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Notices Feed */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Priority Notices ({notices.length})
          </h3>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {notices.map((n) => {
              const isSelected = selectedNotice?.id === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNotice(n)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-red-500 shadow-xl ring-1 ring-red-500/50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-red-400">{n.noticeNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      n.violationSeverity === 'CRITICAL' ? 'bg-red-900/80 text-red-200' : 'bg-amber-900/80 text-amber-200'
                    }`}>
                      {n.violationSeverity}
                    </span>
                  </div>
                  <p className="font-bold text-white text-xs truncate">{n.violatorName}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 inline" />
                    <span className="truncate">{n.location}</span>
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Penalty: <strong className="text-emerald-400 font-bold">₹ {n.penaltyAmountRupees?.toLocaleString('en-IN')}</strong></span>
                    <span className="text-slate-500">{n.issueDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Notice View */}
        <div className="lg:col-span-7">
          {selectedNotice ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
              
              {/* Notice Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Official Legal Notice</span>
                  <h4 className="text-sm font-extrabold text-white">{selectedNotice.noticeNumber}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPrintableModal(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Printable CPCB Format</span>
                  </button>
                </div>
              </div>

              {/* Violator & Location Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Violator Name</span>
                  <strong className="text-slate-200 font-bold">{selectedNotice.violatorName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Entity Category</span>
                  <strong className="text-amber-400 font-bold">{selectedNotice.violatorType}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Applicable Clause</span>
                  <strong className="text-cyan-400 font-semibold">{selectedNotice.cpcbClause}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Fine Amount & Compliance</span>
                  <strong className="text-emerald-400 font-bold">₹ {selectedNotice.penaltyAmountRupees?.toLocaleString('en-IN')} ({selectedNotice.fineDeadlineDays} Days)</strong>
                </div>
              </div>

              {/* Legal Text Body */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-lg space-y-2 text-xs font-mono text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                <p className="font-bold text-red-400">CENTRAL POLLUTION CONTROL BOARD (AIR ACT 1981):</p>
                <p>{selectedNotice.legalText}</p>
              </div>

              {/* Satellite Evidence Photo Attachment */}
              {selectedNotice.satelliteProofUrl && (
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                    <span>Attached Satellite & Drone Evidence Photo:</span>
                  </span>
                  <div className="h-36 rounded-lg overflow-hidden border border-slate-800 relative group">
                    <img
                      src={selectedNotice.satelliteProofUrl}
                      alt="Satellite evidence"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
                      GPS: {selectedNotice.lat}, {selectedNotice.lng} • Sentinel-5P Plume Verified
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Select an enforcement notice to view legal clauses and evidence package
            </div>
          )}
        </div>

      </div>

      {/* Modal: Generate CPCB Regulatory Notice Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span>Issue CPCB Regulatory Notice</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Violator Entity Name</label>
                <input
                  type="text"
                  value={violatorName}
                  onChange={(e) => setViolatorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Violation Category</label>
                  <select
                    value={violatorType}
                    onChange={(e: any) => setViolatorType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="Construction Site">Construction Site</option>
                    <option value="Industrial Stack">Industrial Stack</option>
                    <option value="Open Waste Burning">Open Waste Burning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Severity / GRAP Stage</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none text-red-400 font-bold"
                  >
                    <option value="CRITICAL">CRITICAL (GRAP IV - ₹5 Lakh Fine)</option>
                    <option value="HIGH">HIGH (GRAP III - ₹2.5 Lakh Fine)</option>
                    <option value="MEDIUM">MEDIUM (GRAP II - ₹1 Lakh Fine)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Location / Ward</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Violation Evidence Summary</label>
                <textarea
                  value={violationDetails}
                  onChange={(e) => setViolationDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none h-20"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg flex items-center space-x-1"
                >
                  {isGenerating ? <span>Auto-generating Legal Notice...</span> : <span>Generate Legal Notice</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable CPCB Notice Modal */}
      {printableModal && selectedNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-lg max-w-2xl w-full p-8 shadow-2xl space-y-6 font-serif">
            
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider">CENTRAL POLLUTION CONTROL BOARD</h2>
              <p className="text-xs font-sans text-slate-600">Ministry of Environment, Forest and Climate Change, Govt. of India</p>
              <p className="text-xs font-mono mt-2 font-bold text-slate-800">{selectedNotice.noticeNumber}</p>
            </div>

            <div className="text-xs space-y-3 font-sans leading-relaxed">
              <div className="flex justify-between font-bold border-b pb-2">
                <span>Date: {selectedNotice.issueDate}</span>
                <span>Category: {selectedNotice.grapCategory}</span>
              </div>

              <p><strong>TO:</strong> {selectedNotice.violatorName}</p>
              <p><strong>LOCATION:</strong> {selectedNotice.location}, {selectedNotice.city}</p>

              <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-900 font-mono text-[11px]">
                {selectedNotice.legalText}
              </div>

              <div>
                <p className="font-bold">MANDATORY COMPLIANCE DIRECTIVES:</p>
                <ul className="list-disc pl-5 text-[11px] space-y-1">
                  <li>Deposit fine of ₹ {selectedNotice.penaltyAmountRupees?.toLocaleString('en-IN')} within {selectedNotice.fineDeadlineDays} days.</li>
                  <li>Deploy mandatory anti-smog water cannons and 100% green dust covers immediately.</li>
                  <li>Submit compliance report to CPCB Regional Cell.</li>
                </ul>
              </div>

              <div className="pt-8 flex justify-between items-end">
                <div className="text-[10px] text-slate-500">
                  <p>Electronically generated from station and enforcement records</p>
                  <p>AirIQ Urban Intelligence Platform 2026</p>
                </div>
                <div className="text-center border-t border-slate-900 pt-1 w-40">
                  <p className="font-bold text-xs">{selectedNotice.assignedOfficer}</p>
                  <p className="text-[10px] text-slate-600">Enforcement Authority</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t font-sans text-xs">
              <button
                onClick={() => setPrintableModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded font-semibold hover:bg-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 flex items-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print Notice</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
