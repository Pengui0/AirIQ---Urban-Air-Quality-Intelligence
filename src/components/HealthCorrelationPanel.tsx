import React, { useEffect, useState } from 'react';
import { Activity, DatabaseZap } from 'lucide-react';

type HealthFeed = { available: boolean; message?: string; source?: string; updatedAt?: string };

export const HealthCorrelationPanel: React.FC = () => {
  const [feed, setFeed] = useState<HealthFeed | null>(null);

  useEffect(() => {
    fetch('/api/health-correlation').then((res) => res.json()).then(setFeed).catch(() => setFeed({ available: false, message: 'The health data service could not be reached.' }));
  }, []);

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-white tracking-tight">AQI & Respiratory Admissions</h2><span className="rounded-full border border-slate-600 bg-slate-800/60 px-2.5 py-0.5 text-xs font-bold text-slate-300">Verified feed only</span></div>
          <p className="mt-1 text-xs text-slate-400">Correlation is rendered only from an authorised hospital or public-health dataset. AirIQ does not estimate admissions.</p>
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-cyan-300/25 bg-cyan-400/5 p-5 text-sm text-slate-300">
        <DatabaseZap className="mb-3 h-5 w-5 text-cyan-300" />
        <p className="font-semibold text-white">{feed?.available ? 'Verified health feed connected' : 'No verified hospital-admissions feed configured'}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{feed?.message || 'Checking data connection…'}</p>
        {feed?.source && <p className="mt-3 text-xs text-cyan-200">Source: {feed.source}{feed.updatedAt ? ` · Updated ${new Date(feed.updatedAt).toLocaleString('en-IN')}` : ''}</p>}
      </div>
    </div>
  );
};
