import React, { useEffect, useState } from 'react';
import { ExternalLink, Satellite } from 'lucide-react';

type SatelliteFeed = { available: boolean; message?: string; source?: string; browseUrl?: string; updatedAt?: string };

export const SatelliteOverlayPanel: React.FC = () => {
  const [feed, setFeed] = useState<SatelliteFeed | null>(null);

  useEffect(() => {
    fetch('/api/satellite').then((res) => res.json()).then(setFeed).catch(() => setFeed({ available: false, message: 'The satellite data service could not be reached.' }));
  }, []);

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-white tracking-tight">Satellite Evidence</h2><span className="rounded-full border border-slate-600 bg-slate-800/60 px-2.5 py-0.5 text-xs font-bold text-slate-300">Verified scenes only</span></div>
          <p className="mt-1 text-xs text-slate-400">Only source-linked Copernicus scenes are shown here; simulated plume tiles have been removed.</p>
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-violet-300/25 bg-violet-400/5 p-5 text-sm text-slate-300">
        <Satellite className="mb-3 h-5 w-5 text-violet-300" />
        <p className="font-semibold text-white">{feed?.available ? 'Verified satellite feed connected' : 'No verified satellite feed configured'}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{feed?.message || 'Checking data connection…'}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {feed?.source && <span className="text-violet-200">Source: {feed.source}</span>}
          {feed?.browseUrl && <a href={feed.browseUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200">Open source scene <ExternalLink className="h-3.5 w-3.5" /></a>}
        </div>
      </div>
    </div>
  );
};
