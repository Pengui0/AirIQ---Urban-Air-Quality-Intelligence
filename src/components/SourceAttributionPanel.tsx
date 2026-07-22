import React, { useState } from 'react';
import { SourceAttribution, CitySummary } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Cpu, Satellite, Sparkles, CheckCircle2, RefreshCw, Info, AlertCircle } from 'lucide-react';

interface SourceAttributionPanelProps {
  city: CitySummary;
  attribution: SourceAttribution | null;
  onRefreshAttribution: () => void;
  isLoading: boolean;
}

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#eab308', '#a855f7', '#64748b'];

export const SourceAttributionPanel: React.FC<SourceAttributionPanelProps> = ({
  city,
  attribution,
  onRefreshAttribution,
  isLoading,
}) => {
  if (!attribution) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-slate-300 font-semibold">Running source apportionment analysis...</p>
        <p className="text-xs text-slate-500 mt-1">Analyzing traffic density, satellite NO2 plumes, and thermal stacks</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Vehicular Exhaust', value: attribution.trafficPct, color: '#ef4444' },
    { name: 'Construction & Dust', value: attribution.constructionPct, color: '#f97316' },
    { name: 'Industrial Stacks', value: attribution.industrialPct, color: '#3b82f6' },
    { name: 'Stubble / Biomass', value: attribution.biomassStubblePct, color: '#eab308' },
    { name: 'Power Plants & Stacks', value: attribution.powerPlantsPct || 8, color: '#a855f7' },
    { name: 'Domestic / Other', value: attribution.dustOtherPct || 6, color: '#64748b' },
  ];

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Source Attribution Analysis</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 inline" />
              <span>Multi-Modal Environmental Intelligence</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time spatial-temporal pollution source breakdown for {city.name}. Confidence score: <strong className="text-emerald-400">{Math.round(attribution.confidenceScore * 100)}%</strong>.
          </p>
        </div>

        <button
          onClick={onRefreshAttribution}
          disabled={isLoading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Re-analyze</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Pie Chart */}
        <div className="lg:col-span-5 h-64 flex flex-col items-center justify-center relative bg-slate-950/60 rounded-xl border border-slate-800/80 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                        <span className="font-bold text-white block">{data.name}</span>
                        <span className="text-emerald-400 font-bold">{data.value}% of total PM2.5</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-white">{city.avgAqi}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">AQI Index</span>
          </div>
        </div>

        {/* Legend & Percentage breakdown */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pieData.map((item) => (
              <div key={item.name} className="bg-slate-800/60 border border-slate-700/60 p-2.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-200 font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-extrabold text-white">{item.value}%</span>
              </div>
            ))}
          </div>

          {/* AI Reasoning Summary Box */}
          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Spatial-Temporal Diagnosis:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {attribution.reasoningSummary}
            </p>
          </div>
        </div>

      </div>

      {/* Spatial Vector Badges & Satellite Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Spatial Vectors */}
        <div className="bg-slate-800/40 border border-slate-700/60 p-3.5 rounded-xl space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase block">Identified Spatial Vectors:</span>
          <div className="flex flex-wrap gap-1.5">
            {attribution.spatialFactors?.map((sf, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                <span>{sf}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Satellite NO2 Proof Note */}
        <div className="bg-purple-950/30 border border-purple-500/30 p-3.5 rounded-xl space-y-1 text-xs">
          <span className="text-purple-300 font-semibold flex items-center space-x-1.5">
            <Satellite className="w-4 h-4 text-purple-400" />
            <span>Sentinel-5P Satellite Verification:</span>
          </span>
          <p className="text-purple-200/90 text-[11px] mt-1">
            {attribution.satelliteEvidenceNote}
          </p>
        </div>

      </div>

    </div>
  );
};
