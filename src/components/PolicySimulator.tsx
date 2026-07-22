import React, { useState, useEffect } from 'react';
import { PolicyParameters, PolicySimulationResult, CitySummary } from '../types';
import { simulatePolicyImpact } from '../services/policyService';
import { Cpu, Sliders, Heart, IndianRupee, ShieldCheck, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface PolicySimulatorProps {
  city: CitySummary;
}

export const PolicySimulator: React.FC<PolicySimulatorProps> = ({ city }) => {
  const [params, setParams] = useState<PolicyParameters>({
    oddEvenRule: true,
    constructionBanPct: 50,
    evFleetPct: 20,
    stubbleBurningReductionPct: 40,
    industrialScrubberPct: 30,
    publicTransitFreqIncreasePct: 25,
  });

  const [result, setResult] = useState<PolicySimulationResult>(() =>
    simulatePolicyImpact(city.avgAqi, params)
  );

  useEffect(() => {
    setResult(simulatePolicyImpact(city.avgAqi, params));
  }, [city.avgAqi, params]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Policy & Counterfactual Simulator</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 font-bold flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 inline" />
              <span>Counterfactual Policy Engine</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate policy interventions for {city.name} (Base AQI: {city.avgAqi}). Recalculate projected AQI drop, lives saved, and economic savings.
          </p>
        </div>

        <button
          onClick={() => setParams({
            oddEvenRule: false,
            constructionBanPct: 0,
            evFleetPct: 0,
            stubbleBurningReductionPct: 0,
            industrialScrubberPct: 0,
            publicTransitFreqIncreasePct: 0,
          })}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 underline"
        >
          Reset Sliders to Baseline
        </button>
      </div>

      {/* Top Projected Outcome KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Projected AQI Delta</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-400">{result.projectedAqi}</span>
            <span className="text-xs font-bold text-emerald-300">
              ({result.aqiDelta} pts / -{result.aqiPercentageReduction}%)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Category shift: <strong className="text-slate-200">{result.categoryBefore}</strong> → <strong className="text-emerald-400">{result.categoryAfter}</strong>
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Lives Saved Yearly</span>
          <div className="flex items-center space-x-2 mt-1">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="text-3xl font-extrabold text-white">{result.livesSavedYearly?.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Lancet 2024 mortality reduction equation</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Monthly Economic Savings</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="text-3xl font-extrabold text-amber-400">₹{result.economicSavingsCroresMonthly} Cr</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Healthcare + Productivity loss prevention</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700 p-4 rounded-xl shadow-lg">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Policy Feasibility Index</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-cyan-400">{result.feasibilityScore}/100</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Implementation ease & budget balance</p>
        </div>

      </div>

      {/* Main Controls & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sliders Column */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Policy Intervention Sliders</span>
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* 1. Odd Even Toggle */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Odd-Even Vehicle Rationing Scheme</span>
                <span className="text-[10px] text-slate-400">Rations 50% non-commercial private cars</span>
              </div>
              <button
                onClick={() => setParams({ ...params, oddEvenRule: !params.oddEvenRule })}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  params.oddEvenRule ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {params.oddEvenRule ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* 2. Construction Ban Slider */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center font-bold text-white">
                <span>Construction & Demolition Halt</span>
                <span className="text-amber-400 font-extrabold">{params.constructionBanPct}% Ban</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.constructionBanPct}
                onChange={(e) => setParams({ ...params, constructionBanPct: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* 3. EV Fleet Transition */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center font-bold text-white">
                <span>EV Fleet & Bus Mandate</span>
                <span className="text-cyan-400 font-extrabold">{params.evFleetPct}% Fleet EV</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.evFleetPct}
                onChange={(e) => setParams({ ...params, evFleetPct: Number(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* 4. Stubble Burning Reduction */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center font-bold text-white">
                <span>Bio-Decomposer & Stubble Mgmt</span>
                <span className="text-yellow-400 font-extrabold">{params.stubbleBurningReductionPct}% Mitigated</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.stubbleBurningReductionPct}
                onChange={(e) => setParams({ ...params, stubbleBurningReductionPct: Number(e.target.value) })}
                className="w-full accent-yellow-500 cursor-pointer"
              />
            </div>

            {/* 5. Industrial Flue Gas Scrubbers */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center font-bold text-white">
                <span>Industrial Wet Scrubber Mandate</span>
                <span className="text-purple-400 font-extrabold">{params.industrialScrubberPct}% Stacks</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.industrialScrubberPct}
                onChange={(e) => setParams({ ...params, industrialScrubberPct: Number(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Counterfactual Breakdown Table */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Intervention Effectiveness Breakdown
          </h3>

          <div className="space-y-2">
            {result.breakdownByIntervention.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">{item.name}</span>
                  <span className="text-[10px] text-slate-500">Cost: ₹{item.costImpactCrores} Cr</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-400 text-sm">-{item.aqiReduction} AQI</span>
                  <span className="text-[10px] text-slate-400 block">pts drop</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-200 leading-relaxed mt-2">
            <strong>Policy Insight:</strong> Combining EV Fleet conversion with bio-decomposer stubble management yields maximum long-term AQI reduction with highest feasibility ROI.
          </div>
        </div>

      </div>

    </div>
  );
};
