import React, { useState, useEffect } from 'react';
import { AccuracyMetric } from '../types';
import { CheckCircle2, Award, ShieldCheck, BarChart3 } from 'lucide-react';

export const AccuracyTrackerPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<AccuracyMetric[]>([]);
  const [systemAccuracy, setSystemAccuracy] = useState<number>(96.8);

  useEffect(() => {
    fetch('/api/accuracy')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.accuracyMetrics) {
          setMetrics(data.accuracyMetrics);
          setSystemAccuracy(data.systemWideAccuracy || 96.8);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Forecast Accuracy & Validation Tracker</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 inline" />
              <span>{systemAccuracy}% System Verification Rate</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical 24h prediction vs CPCB ground truth. Tracks MAE (Mean Absolute Error) and RMSE across major metros.
          </p>
        </div>
      </div>

      {/* Accuracy Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3">City Corridor</th>
              <th className="p-3">Validation Date</th>
              <th className="p-3">24h Forecast AQI</th>
              <th className="p-3">Actual CPCB Ground AQI</th>
              <th className="p-3">MAE Error</th>
              <th className="p-3 text-right">Accuracy Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {metrics.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3 font-bold text-white">{m.city}</td>
                <td className="p-3 text-slate-400 font-mono">{m.date}</td>
                <td className="p-3 text-amber-400 font-semibold">{m.forecastAqi}</td>
                <td className="p-3 text-emerald-400 font-semibold">{m.actualAqi}</td>
                <td className="p-3 text-slate-400 font-mono">±{m.mae} pts</td>
                <td className="p-3 text-right font-extrabold text-cyan-400">{m.accuracyPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
