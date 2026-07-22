import React, { useState } from 'react';
import { CitySummary, IndianLanguage } from '../types';
import { INDIAN_LANGUAGES } from '../data/indiaCitiesData';
import { Heart, Globe, School, Stethoscope, AlertTriangle, Languages, Sparkles, RefreshCw } from 'lucide-react';

interface CitizenAdvisoryPanelProps {
  city: CitySummary;
  onFetchAdvisory: (langCode: string, ward: string) => Promise<any>;
}

export const CitizenAdvisoryPanel: React.FC<CitizenAdvisoryPanelProps> = ({
  city,
  onFetchAdvisory,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>('hi');
  const [selectedWard, setSelectedWard] = useState<string>('Anand Vihar Ward 12');
  const [advisoryData, setAdvisoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTranslate = async (langCode: string) => {
    setSelectedLang(langCode);
    setIsLoading(true);
    try {
      const data = await onFetchAdvisory(langCode, selectedWard);
      setAdvisoryData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-surface rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Ward-Level Citizen Health Advisory</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-bold flex items-center space-x-1">
              <Languages className="w-3.5 h-3.5 inline" />
              <span>12 Indian Languages</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multilingual health risk mapping for vulnerable demographics (Schools, Elderly, Hospitals, Outdoor Workers).
          </p>
        </div>

        {/* Language Quick Selector Pills */}
        <div className="flex flex-wrap gap-1 max-w-md">
          {INDIAN_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleTranslate(l.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedLang === l.code
                  ? 'bg-amber-600 text-white shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Advisory Content Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
        
        {/* Top Ward Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Ward & City</span>
            <span className="text-sm font-extrabold text-white">{selectedWard}, {city.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Current AQI:</span>
            <span className="text-lg font-extrabold text-red-400">{city.avgAqi}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-200 font-bold uppercase">
              {city.category}
            </span>
          </div>
        </div>

        {/* Multilingual Headline */}
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            <span>Generating advisory in {INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.name}...</span>
          </div>
        ) : (
          <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl text-amber-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Official Advisory ({INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.name})</span>
            </span>
            <p className="text-sm font-extrabold leading-snug">
              {advisoryData?.headline || (selectedLang === 'hi' 
                ? `आनंद विहार वार्ड: वायु गुणवत्ता सूचकांक ${city.avgAqi} पर पहुंचा। स्वास्थ्य संबंधी विशेष सावधानी बरतें।`
                : `Ward Alert: Air Quality Index reached ${city.avgAqi} (${city.category}). High health risk.`
              )}
            </p>
          </div>
        )}

        {/* Target Demographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center space-x-2 text-red-400 font-bold text-xs">
              <School className="w-4 h-4 text-red-400" />
              <span>Children & School Principals:</span>
            </div>
            <p className="text-slate-300 text-xs">
              {advisoryData?.schoolAdvice || (selectedLang === 'hi'
                ? 'सभी बाहरी खेल गतिविधियों पर रोक लगाएं। स्कूल आने-जाने के दौरान मास्क अनिवार्य है।'
                : 'Suspend all outdoor physical activities. Mandatory N95 masks during school commute.'
              )}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <Heart className="w-4 h-4 text-amber-400" />
              <span>Elderly & Cardiac/Lung Patients:</span>
            </div>
            <p className="text-slate-300 text-xs">
              {advisoryData?.vulnerableAdvice || (selectedLang === 'hi'
                ? 'सुबह और देर शाम की सैर से पूरी तरह बचें। कमरे के अंदर एयर प्यूरिफायर चलाएं।'
                : 'Avoid morning and evening outdoor walks. Keep indoor air filtration active.'
              )}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <span>Outdoor Laborers & Traffic Police:</span>
            </div>
            <p className="text-slate-300 text-xs">
              {advisoryData?.generalAdvice || (selectedLang === 'hi'
                ? 'ड्यूटी पर अनिवार्य N95 रेस्पिरेटर मास्क पहनें। हर 2 घंटे में पानी और हाइड्रेशन लें।'
                : 'Mandatory N95 respirator during duty shifts. Hydrate frequently.'
              )}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Recommended PPE</span>
              <span className="text-xs font-bold text-emerald-400">
                {advisoryData?.recommendedMask || 'N95 / N99 Respirator Mask'}
              </span>
            </div>
            <div className="px-3 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-lg">
              Verified PPE
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
