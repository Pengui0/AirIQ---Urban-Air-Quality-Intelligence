import React, { useState, useEffect } from 'react';
import { SatelliteHotspot } from '../types';
import { Satellite, ShieldAlert, Sparkles, MapPin, Eye, ExternalLink } from 'lucide-react';

export const SatelliteOverlayPanel: React.FC = () => {
  const [hotspots, setHotspots] = useState<SatelliteHotspot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/satellite')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hotspots) {
          setHotspots(data.hotspots);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Sentinel-5P NO2 Satellite Overlay (Simulated)</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 font-bold flex items-center space-x-1">
              <Satellite className="w-3.5 h-3.5 inline animate-pulse" />
              <span>ESA Copernicus TROPOMI (Simulated Grid)</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fusing orbital NO2 column density imagery with ground CAAQMS stations. Covers 97% of Indian landmass lacking ground sensors.
          </p>
        </div>
      </div>

      {/* Satellite Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hotspots.map((h) => (
          <div key={h.id} className="bg-slate-950/80 border border-purple-900/40 p-4 rounded-xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-400 font-extrabold uppercase font-mono">{h.id}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                h.intensity === 'EXTREME' ? 'bg-purple-900 text-purple-200 border border-purple-500' : 'bg-amber-900 text-amber-200'
              }`}>
                {h.intensity}
              </span>
            </div>

            <p className="font-bold text-white text-xs truncate">{h.locationName}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{h.city}</span>
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">NO2 Density:</span>
              <strong className="text-purple-300 font-mono font-bold">{h.no2ColumnDensity} x10¹⁵ molec/cm²</strong>
            </div>

            <div className="text-[9px] text-slate-500 font-mono">
              Source: {h.sourceType}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
