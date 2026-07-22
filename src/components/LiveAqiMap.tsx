import React, { useMemo, useState } from 'react';
import { AQICategory, CitySummary, StationData } from '../types';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, ChevronRight, CloudSun, MapPin, Radio, Wind } from 'lucide-react';

interface LiveAqiMapProps {
  stations: StationData[];
  cities: CitySummary[];
  selectedCity: string;
  onSelectStation: (station: StationData) => void;
  selectedStation: StationData | null;
}

const categoryStyle: Record<AQICategory, { label: string; accent: string; surface: string }> = {
  Good: { label: 'Good', accent: 'text-emerald-300', surface: 'bg-emerald-400' },
  Satisfactory: { label: 'Satisfactory', accent: 'text-lime-300', surface: 'bg-lime-400' },
  Moderate: { label: 'Moderate', accent: 'text-amber-300', surface: 'bg-amber-400' },
  Poor: { label: 'Poor', accent: 'text-orange-300', surface: 'bg-orange-400' },
  'Very Poor': { label: 'Very poor', accent: 'text-rose-300', surface: 'bg-rose-500' },
  Severe: { label: 'Severe', accent: 'text-fuchsia-300', surface: 'bg-fuchsia-500' },
  'Severe Plus': { label: 'Severe+', accent: 'text-red-300', surface: 'bg-red-500' },
};

export const LiveAqiMap: React.FC<LiveAqiMapProps> = ({ stations, cities, selectedCity, onSelectStation, selectedStation }) => {
  const [stationView, setStationView] = useState<'all' | 'risk'>('all');
  const city = cities.find((item) => item.name === selectedCity) ?? cities[0];
  const cityStations = useMemo(() => {
    const local = stations.filter((station) => station.city === city.name);
    const visible = local.length ? local : stations;
    return stationView === 'risk' ? visible.filter((station) => station.aqi > 200) : visible;
  }, [city.name, stationView, stations]);
  const selected = selectedStation && cityStations.find((station) => station.id === selectedStation.id) ? selectedStation : cityStations[0];
  const trendUp = city.trend === 'worsening';
  const aqi = categoryStyle[city.category];
  const highestStation = [...cityStations].sort((a, b) => b.aqi - a.aqi)[0];
  const reportingStationCount = cityStations.filter((station) => !station.isStale).length;
  const reportingCoverage = cityStations.length ? Math.round((reportingStationCount / cityStations.length) * 100) : 0;

  return (
    <section className="glass-surface overflow-hidden rounded-3xl">
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 px-6 py-7 sm:px-8">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <Radio className="h-3.5 w-3.5" /> Live city brief
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{city.name} <span className="text-lg font-medium text-cyan-200/80">· {city.state}</span></h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">A clear, decision-ready readout of today’s air quality, local monitoring network, and the next 72 hours.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Network</p>
              <p className="mt-1 text-sm font-semibold text-white">{city.stationCount} active stations</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Primary pollutant</p>
              <p className="mt-1 text-sm font-semibold text-white">{city.primaryPollutant}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-12 lg:p-6">
        <article className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 lg:col-span-5">
          <div className={`absolute right-0 top-0 h-36 w-36 translate-x-8 -translate-y-8 rounded-full ${aqi.surface} opacity-15 blur-2xl`} />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current city AQI</p>
          <div className="mt-4 flex items-end justify-between">
            <div className="flex items-end gap-3">
              <span className="text-7xl font-semibold leading-none tracking-tighter text-white">{city.avgAqi}</span>
              <span className={`mb-2 rounded-full border border-current/25 bg-white/5 px-3 py-1 text-sm font-semibold ${aqi.accent}`}>{aqi.label}</span>
            </div>
            <div className={`mb-1 flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-rose-300' : 'text-emerald-300'}`}>
              {trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {city.trend}
            </div>
          </div>
          <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${aqi.surface}`} style={{ width: `${Math.min((city.avgAqi / 500) * 100, 100)}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-[11px] font-medium text-slate-500"><span>Good</span><span>Moderate</span><span>Severe</span></div>
          {city.emergencyAlert && <div className="mt-6 flex gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-sm text-orange-100"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" /><span>Health advisory is active. Limit prolonged outdoor exertion and protect sensitive groups.</span></div>}
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 lg:col-span-4">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">72-hour outlook</p><p className="mt-1 text-sm font-medium text-slate-300">Forecast AQI trend</p></div><CloudSun className="h-5 w-5 text-cyan-300" /></div>
          <div className="mt-7 grid grid-cols-3 divide-x divide-slate-800">
            {[['24h', city.forecast24h], ['48h', city.forecast48h], ['72h', city.forecast72h]].map(([label, value]) => <div key={String(label)} className="px-3 first:pl-0 last:pr-0"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-[11px] text-slate-500">AQI forecast</p></div>)}
          </div>
          <button
            type="button"
            onClick={() => document.getElementById('monitoring-stations')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="mt-8 flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-left transition hover:bg-slate-800 focus:outline-none"
            aria-label="View monitored station conditions"
          >
            <span className="flex items-center gap-2 text-sm text-slate-300"><Wind className="h-4 w-4 text-cyan-300" /> Conditions monitored</span>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 lg:col-span-3">
          <Activity className="h-5 w-5 text-emerald-300" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Monitoring network</p>
          <p className="mt-2 text-3xl font-semibold text-white">{reportingCoverage}%</p>
          <p className="mt-1 text-sm leading-5 text-slate-400">{reportingStationCount} of {cityStations.length} station readings are current</p>
          <div className="mt-6 border-t border-slate-800 pt-4 text-xs font-medium text-emerald-300">{highestStation ? `Highest reading: ${highestStation.name} · AQI ${highestStation.aqi}` : 'Waiting for station readings'}</div>
        </article>
      </div>

      <div id="monitoring-stations" className="scroll-mt-28 border-t border-slate-800 bg-slate-950/30 p-5 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-base font-semibold text-white">Monitoring stations</h3><p className="mt-1 text-xs text-slate-500">Select a station to inspect its pollutant readings.</p></div><div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1 text-xs"><button onClick={() => setStationView('all')} className={`rounded-md px-3 py-1.5 ${stationView === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>All stations</button><button onClick={() => setStationView('risk')} className={`rounded-md px-3 py-1.5 ${stationView === 'risk' ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>Risk only</button></div></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {cityStations.slice(0, 6).map((station) => {
            const active = selected?.id === station.id; const style = categoryStyle[station.category];
            return <button key={station.id} onClick={() => onSelectStation(station)} className={`rounded-xl border p-4 text-left transition ${active ? 'border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-950/20' : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-800'}`}><div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-1.5 text-sm font-semibold text-white"><MapPin className="h-3.5 w-3.5 text-slate-500" />{station.name}</p><p className="mt-1 truncate text-xs text-slate-500">{station.address || station.city}</p></div><span className={`text-2xl font-semibold ${style.accent}`}>{station.aqi}</span></div><div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs"><span className="text-slate-500">PM2.5 <strong className="ml-1 text-slate-200">{station.pm25}</strong></span><span className={style.accent}>{style.label}</span></div></button>;
          })}
        </div>
        {!cityStations.length && <p className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">No stations match this filter.</p>}
        {highestStation && <p className="mt-4 text-xs text-slate-500">Highest current reading: <span className="font-semibold text-slate-300">{highestStation.name} · AQI {highestStation.aqi}</span></p>}
      </div>
    </section>
  );
};
