import React, { useState } from 'react';
import { StationData, CitySummary, AQICategory, SatelliteHotspot } from '../types';
import { MapPin, Layers, Satellite, Eye, Filter, Info, AlertTriangle, ChevronRight, Wind, Crosshair } from 'lucide-react';

interface LiveAqiMapProps {
  stations: StationData[];
  cities: CitySummary[];
  satHotspots: SatelliteHotspot[];
  selectedCity: string;
  onSelectStation: (station: StationData) => void;
  selectedStation: StationData | null;
}

export const LiveAqiMap: React.FC<LiveAqiMapProps> = ({
  stations,
  cities,
  satHotspots,
  selectedCity,
  onSelectStation,
  selectedStation,
}) => {
  const [activePollutant, setActivePollutant] = useState<'PM2.5' | 'NO2' | 'PM10'>('PM2.5');
  const [showSatelliteOverlay, setShowSatelliteOverlay] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Filter stations for the view
  const currentCityObj = cities.find(c => c.name.toLowerCase() === selectedCity.toLowerCase()) || cities[0];

  const getAqiBg = (category: AQICategory) => {
    switch (category) {
      case 'Good': return 'bg-emerald-500 text-white border-emerald-400';
      case 'Satisfactory': return 'bg-lime-500 text-slate-900 border-lime-400';
      case 'Moderate': return 'bg-yellow-500 text-slate-900 border-yellow-400';
      case 'Poor': return 'bg-orange-500 text-white border-orange-400';
      case 'Very Poor': return 'bg-red-600 text-white border-red-400';
      case 'Severe': return 'bg-purple-700 text-white border-purple-400';
      case 'Severe Plus': return 'bg-rose-900 text-white border-rose-500 animate-pulse';
      default: return 'bg-slate-600 text-white border-slate-500';
    }
  };

  const getAqiColorCode = (aqi: number) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#84cc16';
    if (aqi <= 200) return '#eab308';
    if (aqi <= 300) return '#f97316';
    if (aqi <= 400) return '#dc2626';
    return '#7e22ce';
  };

  // Convert GPS (Lat/Lng) to percentage SVG coordinates for India map projection
  // India Bounds: Lat 6.4 to 35.5, Lng 68.0 to 98.0
  const latLngToPercent = (lat: number, lng: number) => {
    const minLat = 6.4;
    const maxLat = 35.5;
    const minLng = 68.0;
    const maxLng = 98.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - (((lat - minLat) / (maxLat - minLat)) * 100);
    return { x: Math.max(3, Math.min(97, x)), y: Math.max(3, Math.min(97, y)) };
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-2xl relative overflow-hidden flex flex-col h-[650px]">
      
      {/* Top Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10 bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 backdrop-blur-md">
        
        {/* Layer Toggles */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Layer:</span>
          {(['PM2.5', 'NO2', 'PM10'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActivePollutant(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activePollutant === p
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Satellite Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSatelliteOverlay(!showSatelliteOverlay)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-all ${
              showSatelliteOverlay
                ? 'bg-purple-900/60 border-purple-500 text-purple-200 shadow-lg'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className={`w-3.5 h-3.5 ${showSatelliteOverlay ? 'text-purple-400 animate-pulse' : ''}`} />
            <span>Sentinel-5P NO2 Plume</span>
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="ALL">All Stations (900+ Feeds)</option>
            <option value="POOR">Poor+ (AQI &gt; 200)</option>
            <option value="SEVERE">Very Poor / Severe Only</option>
          </select>
        </div>

      </div>

      {/* Main Interactive Map Viewport */}
      <div className="relative flex-1 rounded-xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 border border-slate-800/90 overflow-hidden group shadow-inner">
        
        {/* Subtle Map Grid / Topographic Mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-20"></div>
        
        {/* Water layer effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        {/* India Outline Vector Canvas - Detailed Map */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {/* India Border - Accurate outline representation */}
          <path
            d="M 35.5 8.5 L 42.0 6.8 L 48.5 7.2 L 55.0 5.5 L 62.5 10.0 L 70.0 8.0 L 78.5 12.0 L 85.0 14.5 L 92.0 18.0 L 95.5 25.0 L 96.5 32.0 L 95.0 38.5 L 92.5 42.0 L 88.0 45.0 L 82.5 48.5 L 78.0 55.0 L 72.0 60.5 L 68.5 67.0 L 63.0 73.0 L 58.0 77.5 L 52.5 82.0 L 48.0 85.5 L 43.0 87.0 L 38.5 85.0 L 35.0 80.0 L 32.5 73.5 L 30.0 67.0 L 28.5 60.0 L 27.0 52.0 L 25.5 43.0 L 24.0 35.0 L 22.5 27.0 L 21.0 20.0 L 20.5 14.5 L 22.0 10.0 L 28.0 8.5 L 35.5 8.5 Z"
            fill="rgba(51,65,85,0.15)"
            stroke="#64748b"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Satellite Plume Overlay Heatmap Effect */}
        {showSatelliteOverlay && (
          <div className="absolute inset-0 pointer-events-none z-5">
            {satHotspots.map((h) => {
              const pos = latLngToPercent(h.lat, h.lng);
              return (
                <div
                  key={h.id}
                  className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse transition-all duration-1000 opacity-70 mix-blend-screen"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: h.intensity === 'EXTREME' ? '160px' : '100px',
                    height: h.intensity === 'EXTREME' ? '160px' : '100px',
                    background: h.intensity === 'EXTREME'
                      ? 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(236,72,153,0.25) 50%, transparent 85%)'
                      : 'radial-gradient(circle, rgba(234,179,8,0.5) 0%, rgba(249,115,22,0.2) 50%, transparent 85%)'
                  }}
                />
              );
            })}
          </div>
        )}

        {/* City Focus Ring */}
        {currentCityObj && (() => {
          const pos = latLngToPercent(currentCityObj.lat, currentCityObj.lng);
          return (
            <div
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400/40 animate-ping" />
            </div>
          );
        })()}

        {/* Station Markers */}
        <div className="absolute inset-0 z-20">
          {stations.map((st) => {
            const pos = latLngToPercent(st.lat, st.lng);
            const isSelected = selectedStation?.id === st.id;
            const tooltipOnLeft = pos.y < 20;

            // Apply filter
            if (filterCategory === 'POOR' && st.aqi < 200) return null;
            if (filterCategory === 'SEVERE' && st.aqi < 300) return null;

            return (
              <div
                key={st.id}
                onClick={() => onSelectStation(st)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 group/marker flex flex-col items-center"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {/* Station Pin Badge — padded wrapper contains the selection ring so it can't bleed into the label */}
                <div className="p-1.5">
                  <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-xs font-bold shadow-lg transition-all ${getAqiBg(st.category)} ${isSelected ? 'ring-4 ring-cyan-400 scale-110' : ''}`}>
                    <MapPin className="w-3 h-3 inline" />
                    <span>{st.aqi}</span>
                  </div>
                </div>

                {/* Always-visible city/station label */}
                <div className="mt-0.5 px-1.5 py-0.5 rounded bg-slate-900/85 border border-slate-700 text-[9px] font-medium text-slate-200 whitespace-nowrap text-center shadow-md pointer-events-none">
                  {st.city}
                </div>

                {/* Hover Tooltip — flips to the left for pins near the top edge so it doesn't get clipped by the map container */}
                <div className={`hidden group-hover/marker:block absolute w-48 bg-slate-900 text-slate-100 p-2.5 rounded-lg border border-slate-700 shadow-2xl z-40 text-xs ${
                  tooltipOnLeft
                    ? 'left-full top-1/2 -translate-y-1/2 ml-3'
                    : 'bottom-full left-1/2 -translate-x-1/2 mb-5'
                }`}>
                  <p className="font-bold text-white truncate">{st.name}</p>
                  <p className="text-slate-400 text-[10px]">{st.address || st.city}</p>
                  <div className="mt-1 flex justify-between items-center text-[11px]">
                    <span className="text-slate-300">PM2.5: <strong className="text-amber-400">{st.pm25} µg/m³</strong></span>
                    <span className="text-slate-300">NO2: <strong className="text-cyan-400">{st.no2} µg/m³</strong></span>
                  </div>
                  <div className="mt-1 text-[9px] text-emerald-400 flex items-center justify-between">
                    <span>{st.source}</span>
                    <span>{st.lastUpdated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-1 z-30 bg-slate-900 border border-slate-700 rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setZoomLevel(Math.min(2.2, zoomLevel + 0.3))}
            className="w-7 h-7 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded flex items-center justify-center font-bold text-sm"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-7 h-7 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded flex items-center justify-center text-xs font-medium"
            title="Reset Zoom"
          >
            1x
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.3))}
            className="w-7 h-7 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded flex items-center justify-center font-bold text-sm"
            title="Zoom Out"
          >
            -
          </button>
        </div>

        {/* Legend Panel */}
        <div className="absolute bottom-4 left-4 z-30 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md shadow-xl text-xs max-w-xs">
          <p className="text-slate-400 font-semibold mb-2 flex items-center justify-between">
            <span>CPCB AQI Scale</span>
            <span className="text-[10px] text-slate-500">IND Standards</span>
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-medium text-center">0-50 Good</span>
            <span className="px-1.5 py-0.5 rounded bg-lime-600 text-white font-medium text-center">51-100 Satis</span>
            <span className="px-1.5 py-0.5 rounded bg-yellow-600 text-slate-900 font-medium text-center">101-200 Mod</span>
            <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white font-medium text-center">201-300 Poor</span>
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-medium text-center">301-400 V.Poor</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-700 text-white font-medium text-center">&gt;400 Severe</span>
          </div>
        </div>

      </div>

      {/* Selected Station Drawer / Info Card */}
      {selectedStation && (
        <div className="mt-4 bg-slate-800/90 border border-slate-700 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-lg font-bold text-sm ${getAqiBg(selectedStation.category)}`}>
              AQI {selectedStation.aqi}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{selectedStation.name}</p>
              <p className="text-slate-400">{selectedStation.address || selectedStation.city} • <span className="text-emerald-400">{selectedStation.source}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-slate-300">
            <div>
              <span className="text-slate-400 text-[10px] block">PM2.5</span>
              <strong className="text-amber-400 font-semibold">{selectedStation.pm25} µg/m³</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">PM10</span>
              <strong className="text-amber-300 font-semibold">{selectedStation.pm10} µg/m³</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">NO2</span>
              <strong className="text-cyan-400 font-semibold">{selectedStation.no2} µg/m³</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">SO2</span>
              <strong className="text-slate-200 font-semibold">{selectedStation.so2} µg/m³</strong>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
