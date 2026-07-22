import React from 'react';
import { CitySummary } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Building2, TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';

interface MultiCityDashboardProps {
  cities: CitySummary[];
  onSelectCity: (cityName: string) => void;
  selectedCity: string;
}

export const MultiCityDashboard: React.FC<MultiCityDashboardProps> = ({
  cities,
  onSelectCity,
  selectedCity,
}) => {
  const chartData = cities.map((c) => ({
    name: c.name,
    aqi: c.avgAqi,
    forecast24h: c.forecast24h,
    costCrores: c.healthCostMonthlyCrores,
  }));

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#84cc16';
    if (aqi <= 200) return '#eab308';
    if (aqi <= 300) return '#f97316';
    if (aqi <= 400) return '#dc2626';
    return '#7e22ce';
  };

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">National Multi-City Command Dashboard</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold">
              Comparative Urban Analytics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side comparison across top Indian metro corridors. Select any card to open its city brief, with state context carried through every workspace.
          </p>
        </div>
      </div>

      {/* Side-by-Side City Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cities.slice(0, 5).map((c) => {
          const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase();
          return (
            <button
              key={c.name}
              onClick={() => onSelectCity(c.name)}
              className={`glass-card w-full p-4 rounded-xl border cursor-pointer text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 truncate">{c.name}</span>
                {c.trend === 'worsening' ? (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                ) : c.trend === 'improving' ? (
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-200/70">{c.state}</p>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-white" style={{ color: getAqiColor(c.avgAqi) }}>
                  {c.avgAqi}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{c.category}</span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>24h Forecast:</span>
                  <strong className="text-amber-400 font-bold">{c.forecast24h}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Violations:</span>
                  <strong className="text-red-400 font-bold">{c.activeViolationsCount}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Health Burden:</span>
                  <strong className="text-emerald-400 font-bold">₹{c.healthCostMonthlyCrores} Cr/mo</strong>
                </div>
              </div>

              {c.emergencyAlert && (
                <div className="mt-2.5 px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-[9px] font-bold text-red-300 text-center uppercase tracking-wider flex items-center justify-center space-x-1">
                  <AlertTriangle className="w-3 h-3 inline" />
                  <span>GRAP Action Triggered</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Comparative Bar Chart */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Comparative AQI & 24h Prediction Benchmark</span>
          <span className="text-[10px] text-slate-500 font-normal">CPCB CAAQMS Real-Time</span>
        </h3>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgb(148 163 184 / 0.12)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1">
                        <p className="font-bold text-white">{data.name}</p>
                        <p className="text-slate-300">Current Avg AQI: <strong className="text-amber-400">{data.aqi}</strong></p>
                        <p className="text-slate-300">24h Forecast: <strong className="text-orange-400">{data.forecast24h}</strong></p>
                        <p className="text-emerald-400">Monthly Cost: ₹{data.costCrores} Cr</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar isAnimationActive={false} dataKey="aqi" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getAqiColor(entry.aqi)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
