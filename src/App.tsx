import React, { useState, useEffect } from 'react';
import { User, UserRole, CitySummary, StationData, EnforcementNotice, SatelliteHotspot, SourceAttribution, ForecastPoint } from './types';
import { INITIAL_CITIES, INITIAL_STATIONS, INITIAL_NOTICES } from './data/indiaCitiesData';
import { Header } from './components/Header';
import { LiveAqiMap } from './components/LiveAqiMap';
import { ForecastPanel } from './components/ForecastPanel';
import { SourceAttributionPanel } from './components/SourceAttributionPanel';
import { EnforcementPanel } from './components/EnforcementPanel';
import { MultiCityDashboard } from './components/MultiCityDashboard';
import { PolicySimulator } from './components/PolicySimulator';
import { CitizenAdvisoryPanel } from './components/CitizenAdvisoryPanel';
import { WhatsAppBotSimulator } from './components/WhatsAppBotSimulator';
import { HealthCostPanel } from './components/HealthCostPanel';
import { SatelliteOverlayPanel } from './components/SatelliteOverlayPanel';
import { AccuracyTrackerPanel } from './components/AccuracyTrackerPanel';
import { HealthCorrelationPanel } from './components/HealthCorrelationPanel';
import { SystemMetricsModal } from './components/SystemMetricsModal';

import { Map, TrendingUp, Cpu, Shield, Building2, Sliders, MessageSquare, IndianRupee, MapPin } from 'lucide-react';

export default function App() {
  // Current logged in persona
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-1',
    name: 'Officer R. K. Sharma',
    email: 'officer.sharma@cpcb.gov.in',
    role: 'OFFICER',
    city: 'Delhi NCR',
    department: 'Central Enforcement Cell',
    badgeNumber: 'CPCB-DEL-2026-08',
  });

  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [selectedState, setSelectedState] = useState<string>('Delhi');
  const [activeTab, setActiveTab] = useState<string>('MAP');

  // State
  const [cities, setCities] = useState<CitySummary[]>(INITIAL_CITIES);
  const [stations, setStations] = useState<StationData[]>(INITIAL_STATIONS);
  const [notices, setNotices] = useState<EnforcementNotice[]>(INITIAL_NOTICES);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(INITIAL_STATIONS[0] || null);
  
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDataStale, setIsDataStale] = useState<boolean>(false);

  // Forecast state
  const [forecastPoints, setForecastPoints] = useState<ForecastPoint[]>([]);
  const [schoolClosureTriggered, setSchoolClosureTriggered] = useState<boolean>(false);

  // Attribution state
  const [attributionData, setAttributionData] = useState<SourceAttribution | null>(null);
  const [isAttributionLoading, setIsAttributionLoading] = useState<boolean>(false);

  // Notice generation loading state
  const [isNoticeGenerating, setIsNoticeGenerating] = useState<boolean>(false);

  // System Telemetry Modal
  const [showMetricsModal, setShowMetricsModal] = useState<boolean>(false);

  // Find active city object
  const activeCityObj = cities.find(c => c.name.toLowerCase() === selectedCity.toLowerCase()) || cities[0];

  const handleSelectState = (state: string) => {
    setSelectedState(state);
    const firstCityInState = cities.find((city) => city.state === state);
    if (firstCityInState) setSelectedCity(firstCityInState.name);
  };

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    const city = cities.find((item) => item.name === cityName);
    if (city) setSelectedState(city.state);
  };

  // Fetch Live Data
  const handleRefreshLiveData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/aqi/live');
      const data = await res.json();
      if (data.success) {
        if (data.cities) setCities(data.cities);
        if (data.stations) setStations(data.stations);
        setLastRefreshed(data.lastRefreshed || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        setIsDataStale(!!data.isStale);
      }
    } catch (err) {
      console.error('Failed to sync live AQI:', err);
      setIsDataStale(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch 72h Forecast for selected city
  const fetchForecast = async (cityName: string) => {
    try {
      const res = await fetch(`/api/aqi/forecast?city=${encodeURIComponent(cityName)}`);
      const data = await res.json();
      if (data.success && data.forecast) {
        setForecastPoints(data.forecast);
        setSchoolClosureTriggered(data.schoolClosureTriggered);
      }
    } catch (err) {
      console.error('Failed to fetch forecast:', err);
    }
  };

  // Fetch AI Attribution
  const fetchAttribution = async (cityName: string) => {
    setIsAttributionLoading(true);
    try {
      const res = await fetch('/api/attribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityName, currentAqi: activeCityObj.avgAqi }),
      });
      const data = await res.json();
      if (data.success && data.attribution) {
        setAttributionData(data.attribution);
      }
    } catch (err) {
      console.error('Failed to fetch attribution:', err);
    } finally {
      setIsAttributionLoading(false);
    }
  };

  // Switch role handler
  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === 'OFFICER') {
      setCurrentUser({
        id: 'usr-1',
        name: 'Officer R. K. Sharma',
        email: 'officer.sharma@cpcb.gov.in',
        role: 'OFFICER',
        city: 'Delhi NCR',
        department: 'Central Enforcement Cell',
      });
      setActiveTab('MAP');
    } else if (newRole === 'POLICYMAKER') {
      setCurrentUser({
        id: 'usr-2',
        name: 'Dr. Anita Roy (NITI Aayog Member)',
        email: 'anita.roy@niti.gov.in',
        role: 'POLICYMAKER',
        city: 'Delhi NCR',
        department: 'Urban Environment Taskforce',
      });
      setActiveTab('SIMULATOR');
    } else {
      setCurrentUser({
        id: 'usr-3',
        name: 'Rahul Varma (Resident)',
        email: 'rahul.v@gmail.com',
        role: 'CITIZEN',
        city: 'Delhi NCR',
      });
      setActiveTab('ADVISORY');
    }
  };

  // Generate new CPCB Notice
  const handleGenerateNotice = async (noticePayload: any) => {
    setIsNoticeGenerating(true);
    try {
      const res = await fetch('/api/enforcement/generate-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticePayload),
      });
      const data = await res.json();
      if (data.success && data.notice) {
        setNotices((prev) => [data.notice, ...prev]);
      }
    } catch (err) {
      console.error('Failed to generate notice:', err);
    } finally {
      setIsNoticeGenerating(false);
    }
  };

  // Advisory API Call
  const handleFetchAdvisory = async (langCode: string, ward: string) => {
    const res = await fetch('/api/advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: selectedCity,
        ward,
        aqi: activeCityObj.avgAqi,
        language: langCode,
      }),
    });
    const data = await res.json();
    return data.advisory;
  };

  // WhatsApp Message Send API
  const handleSendWhatsAppMessage = async (msgText: string) => {
    const res = await fetch('/api/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msgText }),
    });
    return await res.json();
  };

  useEffect(() => {
    fetchForecast(selectedCity);
    fetchAttribution(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const firstStationInCity = stations.find((station) => station.city === selectedCity) || null;
    setSelectedStation(firstStationInCity);
  }, [selectedCity, stations]);

  const NAV_ITEMS = [
    { id: 'MAP', label: 'Live AQI & Satellite Map', icon: Map, color: 'emerald' },
    { id: 'FORECAST', label: '72h Forecast & School Alerts', icon: TrendingUp, color: 'amber' },
    { id: 'ATTRIBUTION', label: 'Source Attribution', icon: Cpu, color: 'purple' },
    { id: 'ENFORCEMENT', label: 'CPCB Enforcement Center', icon: Shield, color: 'red' },
    { id: 'MULTICITY', label: 'Multi-City Command', icon: Building2, color: 'cyan' },
    { id: 'SIMULATOR', label: 'Policy Simulator', icon: Sliders, color: 'blue' },
    { id: 'ADVISORY', label: 'Citizen & WhatsApp Bot', icon: MessageSquare, color: 'emerald' },
    { id: 'HEALTHCOST', label: 'Health Cost & Accuracy', icon: IndianRupee, color: 'indigo' },
  ] as const;

  const navColorClasses: Record<string, string> = {
    emerald: 'bg-emerald-600 shadow-emerald-950',
    amber: 'bg-amber-600 shadow-amber-950',
    purple: 'bg-purple-600 shadow-purple-950',
    red: 'bg-red-600 shadow-red-950',
    cyan: 'bg-cyan-600 shadow-cyan-950',
    blue: 'bg-blue-600 shadow-blue-950',
    indigo: 'bg-indigo-600 shadow-indigo-950',
  };

  return (
    <div className="airiq-app min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header & Role Switcher */}
      <Header
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        selectedCity={selectedCity}
        selectedState={selectedState}
        onSelectState={handleSelectState}
        onSelectCity={handleSelectCity}
        cities={cities}
        lastRefreshed={lastRefreshed}
        onRefreshData={handleRefreshLiveData}
        isRefreshing={isRefreshing}
        onOpenMetrics={() => setShowMetricsModal(true)}
        isDataStale={isDataStale}
      />

      {/* Primary Navigation Tabs */}
      <nav className="glass-nav sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-1.5 py-2.5">
          
          <button
            onClick={() => setActiveTab('MAP')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'MAP'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Live AQI & Satellite Map</span>
          </button>

          <button
            onClick={() => setActiveTab('FORECAST')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'FORECAST'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>72h Forecast & School Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('ATTRIBUTION')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'ATTRIBUTION'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Source Attribution</span>
          </button>

          <button
            onClick={() => setActiveTab('ENFORCEMENT')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'ENFORCEMENT'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>CPCB Enforcement Center</span>
          </button>

          <button
            onClick={() => setActiveTab('MULTICITY')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'MULTICITY'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Multi-City Command</span>
          </button>

          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'SIMULATOR'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Policy Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('ADVISORY')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'ADVISORY'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Citizen & WhatsApp Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('HEALTHCOST')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'HEALTHCOST'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Health Cost & Accuracy</span>
          </button>

        </div>
      </nav>

      {/* Main Content Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="region-context flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-slate-300"><MapPin className="h-4 w-4 text-cyan-300" /><span>Viewing live intelligence for <strong className="text-white">{activeCityObj.name}</strong>, {activeCityObj.state}</span></div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-medium text-slate-400" htmlFor="dashboard-state">State</label>
            <select id="dashboard-state" value={selectedState} onChange={(event) => handleSelectState(event.target.value)} className="rounded-lg border border-slate-600/70 bg-slate-950/50 px-2 py-1 text-xs font-semibold text-slate-100">
              {[...new Set(cities.map((city) => city.state))].map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
            <label className="text-xs font-medium text-slate-400" htmlFor="dashboard-city">City</label>
            <select id="dashboard-city" value={selectedCity} onChange={(event) => handleSelectCity(event.target.value)} className="rounded-lg border border-cyan-400/30 bg-slate-950/50 px-2 py-1 text-xs font-semibold text-cyan-100">
              {cities.filter((city) => city.state === selectedState).map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
            </select>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">AQI {activeCityObj.avgAqi} · {activeCityObj.category}</span>
          </div>
        </div>
        
        {/* Active Tab Content Switching */}
        {activeTab === 'MAP' && (
          <div className="space-y-6">
            <LiveAqiMap
              stations={stations}
              cities={cities}
              satHotspots={[]}
              selectedCity={selectedCity}
              onSelectStation={(st) => setSelectedStation(st)}
              selectedStation={selectedStation}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ForecastPanel
                city={activeCityObj}
                forecastPoints={forecastPoints}
                schoolClosureTriggered={schoolClosureTriggered}
              />
              <SourceAttributionPanel
                city={activeCityObj}
                attribution={attributionData}
                onRefreshAttribution={() => fetchAttribution(selectedCity)}
                isLoading={isAttributionLoading}
              />
            </div>
          </div>
        )}

        {activeTab === 'FORECAST' && (
          <ForecastPanel
            city={activeCityObj}
            forecastPoints={forecastPoints}
            schoolClosureTriggered={schoolClosureTriggered}
          />
        )}

        {activeTab === 'ATTRIBUTION' && (
          <SourceAttributionPanel
            city={activeCityObj}
            attribution={attributionData}
            onRefreshAttribution={() => fetchAttribution(selectedCity)}
            isLoading={isAttributionLoading}
          />
        )}

        {activeTab === 'ENFORCEMENT' && (
          <EnforcementPanel
            city={activeCityObj}
            notices={notices}
            onGenerateNewNotice={handleGenerateNotice}
            isGenerating={isNoticeGenerating}
          />
        )}

        {activeTab === 'MULTICITY' && (
          <MultiCityDashboard
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={(cityName) => { handleSelectCity(cityName); setActiveTab('MAP'); }}
          />
        )}

        {activeTab === 'SIMULATOR' && (
          <PolicySimulator city={activeCityObj} />
        )}

        {activeTab === 'ADVISORY' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <CitizenAdvisoryPanel
                city={activeCityObj}
                onFetchAdvisory={handleFetchAdvisory}
              />
            </div>
            <div className="lg:col-span-5">
              <WhatsAppBotSimulator
                onSendMessage={handleSendWhatsAppMessage}
              />
            </div>
          </div>
        )}

        {activeTab === 'HEALTHCOST' && (
          <div className="space-y-6">
            <HealthCostPanel city={activeCityObj} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AccuracyTrackerPanel />
              <HealthCorrelationPanel />
            </div>
            <SatelliteOverlayPanel />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="glass-footer text-slate-400 py-6 text-xs text-center space-y-2">
        <p className="font-semibold text-slate-300">
          AirIQ — Urban Air Quality Intelligence Platform • Team Project 2026
        </p>
        <p className="text-[11px] text-slate-500 max-w-3xl mx-auto">
          Powered by CPCB CAAQMS Station Feeds, Physics-Informed Atmospheric Forecast Models, Simulated Copernicus Sentinel-5P Satellite Overlays, and the AirIQ operational engine.
        </p>
      </footer>

      {/* Telemetry Modal */}
      {showMetricsModal && (
        <SystemMetricsModal onClose={() => setShowMetricsModal(false)} />
      )}

    </div>
  );
}
