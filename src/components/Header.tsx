import React from 'react';
import { User, UserRole, CitySummary } from '../types';
import { Shield, Users, Cpu, RefreshCw, BarChart2, MapPin, ChevronDown, Wind } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  selectedCity: string;
  selectedState: string;
  onSelectState: (state: string) => void;
  onSelectCity: (city: string) => void;
  cities: CitySummary[];
  lastRefreshed: string;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onOpenMetrics: () => void;
  isDataStale?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  selectedCity,
  selectedState,
  onSelectState,
  onSelectCity,
  cities,
  lastRefreshed,
  onRefreshData,
  isRefreshing,
  onOpenMetrics,
  isDataStale,
}) => {
  const states = [...new Set(cities.map((city) => city.state))];
  const citiesInState = cities.filter((city) => city.state === selectedState);
  return (
    <header className="glass-header text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Live Indicator */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/35 bg-gradient-to-br from-cyan-400/20 via-emerald-400/10 to-indigo-500/20 shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_8px_20px_rgb(6_182_212/0.15)]">
            <span className="absolute h-7 w-7 rounded-full border border-cyan-200/20" />
            <Wind className="relative h-5 w-5 text-cyan-200" strokeWidth={2.3} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">AirIQ</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30 font-medium">
                v2026.1
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>
                {isDataStale ? 'Cached reference data' : 'CPCB CAAQMS Feed'} • Updated {lastRefreshed}
              </span>
              {isDataStale && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-semibold uppercase tracking-wide">
                  Cached
                </span>
              )}
            </div>
          </div>
        </div>

        {/* City Selector */}
        <div className="hidden lg:flex items-center gap-2 glass-control rounded-xl px-3 py-1.5">
          <MapPin className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-xs text-slate-400 font-medium">Focus region</span>
          <select value={selectedState} onChange={(e) => onSelectState(e.target.value)} className="bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer">
            {states.map((state) => <option key={state} value={state} className="bg-slate-900 text-slate-200">{state}</option>)}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="bg-transparent text-sm font-semibold text-emerald-300 focus:outline-none cursor-pointer"
          >
            {citiesInState.map((c) => (
              <option key={c.name} value={c.name} className="bg-slate-900 text-slate-200">
                {c.name} (AQI {c.avgAqi})
              </option>
            ))}
          </select>
        </div>

        {/* Persona Switcher & System Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            title="Force refresh live monitoring stations"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={onOpenMetrics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            title="System Telemetry & Ingestion Metrics"
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Telemetry</span>
          </button>

          {/* Persona Quick Toggle Bar */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => onSwitchRole('OFFICER')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentUser.role === 'OFFICER'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Officer</span>
            </button>
            <button
              onClick={() => onSwitchRole('POLICYMAKER')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentUser.role === 'POLICYMAKER'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Policymaker</span>
            </button>
            <button
              onClick={() => onSwitchRole('CITIZEN')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentUser.role === 'CITIZEN'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
