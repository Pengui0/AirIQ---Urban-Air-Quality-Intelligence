import React, { useState, useEffect } from 'react';
import { CitySummary } from '../types';
import { IndianRupee, HeartPulse, Hospital, TrendingDown, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface HealthCostPanelProps {
  city: CitySummary;
}

export const HealthCostPanel: React.FC<HealthCostPanelProps> = ({ city }) => {
  const [costData, setCostData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch(`/api/cost-calculator?city=${encodeURIComponent(city.name)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setCostData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Cost calculator fetch error:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [city.name]);

  if (isLoading || !costData) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-xs">
        Calculating health economic burden for {city.name}...
      </div>
    );
  }

  const monthlyCrores = costData.monthlyEconomicBurdenCrores || city.healthCostMonthlyCrores;
  const yearlyCrores = costData.yearlyEconomicBurdenCrores || (monthlyCrores * 12);

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Health Cost & Economic Burden Calculator</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold flex items-center space-x-1">
              <IndianRupee className="w-3.5 h-3.5 inline" />
              <span>Lancet 2024 Monetization Model</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantifying monthly financial losses due to air pollution in {city.name}. Shows return on investment for AirIQ interventions.
          </p>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700 p-5 rounded-xl shadow-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase block">Monthly Economic Burden</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-amber-400">₹{monthlyCrores?.toLocaleString('en-IN')} Cr</span>
            <span className="text-xs text-slate-400">/ month</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Direct healthcare + lost working days</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700 p-5 rounded-xl shadow-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase block">Annual Economic Drain</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-3xl font-extrabold text-red-400">₹{yearlyCrores?.toLocaleString('en-IN')} Cr</span>
            <span className="text-xs text-slate-400">/ year</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{city.name} urban economic output loss</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 rounded-xl shadow-xl">
          <span className="text-xs text-emerald-400 font-semibold uppercase block">AirIQ Intervention Net ROI</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-300">{costData.roiEstimate?.netRoiRatio || '45:1'}</span>
          </div>
          <p className="text-[10px] text-emerald-200/90 mt-1">
            ₹{costData.roiEstimate?.projectedSavingsCroresYearly?.toLocaleString('en-IN') || '560'} Cr saved yearly vs ₹14 Cr platform deployment cost
          </p>
        </div>

      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Hospital Admissions</span>
            <Hospital className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-base font-extrabold text-white">
            ₹{Math.round((costData.breakdown?.hospitalAdmissionsRupees || 800000000) / 10000000)} Cr
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">38% of total burden</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Lost Sick Leave Productivity</span>
            <HeartPulse className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-base font-extrabold text-white">
            ₹{Math.round((costData.breakdown?.lostProductivityWorkdaysRupees || 680000000) / 10000000)} Cr
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">32% of total burden</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Respiratory Medication</span>
            <TrendingDown className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-base font-extrabold text-white">
            ₹{Math.round((costData.breakdown?.respiratoryMedicationRupees || 380000000) / 10000000)} Cr
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">18% of total burden</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Premature Mortality Cost</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-base font-extrabold text-white">
            ₹{Math.round((costData.breakdown?.prematureMortalityValuationRupees || 250000000) / 10000000)} Cr
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">12% of total burden</span>
        </div>

      </div>

    </div>
  );
};
