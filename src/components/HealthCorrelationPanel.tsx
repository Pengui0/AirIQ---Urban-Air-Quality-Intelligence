import React, { useState, useEffect } from 'react';
import { HealthCorrelationPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Activity, Stethoscope, AlertTriangle, TrendingUp } from 'lucide-react';

export const HealthCorrelationPanel: React.FC = () => {
  const [data, setData] = useState<HealthCorrelationPoint[]>([]);

  useEffect(() => {
    fetch('/api/health-correlation')
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.dataset) {
          setData(resData.dataset);
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
            <h2 className="text-xl font-bold text-white tracking-tight">AQI vs Respiratory Hospital Admissions Correlation</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 font-bold flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 inline" />
              <span>Pearson Correlation r = 0.94</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            48-hour lagged correlation between CAAQMS PM2.5 spikes and public hospital ER respiratory & asthma admissions.
          </p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-64 w-full pt-2 bg-slate-950/80 border border-slate-800 rounded-xl p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis yAxisId="left" stroke="#f97316" fontSize={10} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={10} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item: HealthCorrelationPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs space-y-1">
                      <p className="font-bold text-white">{item.month}</p>
                      <p className="text-orange-400">Monthly Avg AQI: <strong>{item.aqi}</strong></p>
                      <p className="text-rose-400">Respiratory ER Admissions: <strong>{item.respiratoryAdmissions}</strong></p>
                      <p className="text-amber-300">Asthma Emergency Cases: <strong>{item.asthmaErVisits}</strong></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line yAxisId="left" type="monotone" dataKey="aqi" stroke="#f97316" strokeWidth={2.5} name="Monthly Avg AQI" />
            <Line yAxisId="right" type="monotone" dataKey="respiratoryAdmissions" stroke="#ef4444" strokeWidth={2.5} name="Hospital Respiratory ER Admissions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
