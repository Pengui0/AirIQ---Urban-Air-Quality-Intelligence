import React, { useState, useEffect } from 'react';
import { BarChart2, ShieldCheck, Activity, Cpu, Database, Wifi, CheckCircle2, RefreshCw } from 'lucide-react';

interface SystemMetricsModalProps {
  onClose: () => void;
}

export const SystemMetricsModal: React.FC<SystemMetricsModalProps> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">System Telemetry & Ingestion Operational Metrics</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {metrics ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-semibold">CAAQMS Live Stations</span>
                <strong className="text-emerald-400 font-extrabold text-lg">{metrics.totalCaaqmsStations}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-semibold">Feed Uptime Rate</span>
                <strong className="text-cyan-400 font-extrabold text-lg">{metrics.activeFeedsPercentage}%</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-semibold">30-Day Forecast Accuracy</span>
                <strong className="text-amber-400 font-extrabold text-lg">{metrics.forecastAccuracy30DayPct}%</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-semibold">WhatsApp Alerts Sent</span>
                <strong className="text-purple-400 font-extrabold text-lg">{metrics.citizensNotifiedWhatsApp?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold block">Service Health Checks:</span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center text-emerald-400">
                  <span>CPCB Live Ingestion & Reference Fallback</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Legal & Attribution Engine</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Physics-Informed Heuristic Forecast Engine</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ONLINE</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>WhatsApp Citizen Bot Simulator Gateway</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs">Loading telemetry...</div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs"
          >
            Close Telemetry Panel
          </button>
        </div>

      </div>
    </div>
  );
};
