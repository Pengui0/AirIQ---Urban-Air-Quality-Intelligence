import React, { useEffect, useState } from 'react';
import { Award, DatabaseZap } from 'lucide-react';

type ValidationFeed = { available: boolean; message?: string; source?: string; updatedAt?: string };

export const AccuracyTrackerPanel: React.FC = () => {
  const [feed, setFeed] = useState<ValidationFeed | null>(null);
  useEffect(() => { fetch('/api/accuracy').then((res) => res.json()).then(setFeed).catch(() => setFeed({ available: false, message: 'The validation service could not be reached.' })); }, []);

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-white tracking-tight">Forecast Validation</h2><span className="rounded-full border border-slate-600 bg-slate-800/60 px-2.5 py-0.5 text-xs font-bold text-slate-300">Observed data only</span></div>
      <div className="rounded-xl border border-dashed border-emerald-300/25 bg-emerald-400/5 p-5 text-sm text-slate-300">
        <Award className="mb-3 h-5 w-5 text-emerald-300" />
        <p className="font-semibold text-white">{feed?.available ? 'Verified forecast validation connected' : 'No verified forecast-validation feed configured'}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{feed?.message || 'Checking data connection…'}</p>
        {feed?.source && <p className="mt-3 text-xs text-emerald-200">Source: {feed.source}</p>}
      </div>
    </div>
  );
};
