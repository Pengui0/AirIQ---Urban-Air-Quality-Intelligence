export type UserRole = 'OFFICER' | 'POLICYMAKER' | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  department?: string;
  badgeNumber?: string;
}

export type PollutantType = 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3';

export type AQICategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe' | 'Severe Plus';

export interface StationData {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  category: AQICategory;
  lastUpdated: string;
  source: 'CPCB CAAQMS' | 'OpenAQ' | 'IMD Station';
  isStale: boolean;
  address?: string;
  primaryPollutant: PollutantType;
}

export interface CitySummary {
  name: string;
  state: string;
  lat: number;
  lng: number;
  avgAqi: number;
  stationCount: number;
  primaryPollutant: PollutantType;
  category: AQICategory;
  trend: 'improving' | 'stable' | 'worsening';
  forecast24h: number;
  forecast48h: number;
  forecast72h: number;
  emergencyAlert: boolean;
  healthCostMonthlyCrores: number;
  activeViolationsCount: number;
}

export interface ForecastPoint {
  timestamp: string;
  hourLabel: string;
  dateLabel: string;
  aqi: number;
  pm25: number;
  no2: number;
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  confidenceLower: number;
  confidenceUpper: number;
  schoolClosureAlert: boolean;
  category: AQICategory;
}

export interface SourceAttribution {
  city: string;
  timestamp: string;
  trafficPct: number;
  constructionPct: number;
  industrialPct: number;
  biomassStubblePct: number;
  powerPlantsPct: number;
  dustOtherPct: number;
  confidenceScore: number; // e.g. 0.92
  reasoningSummary: string;
  spatialFactors: string[];
  satelliteEvidenceNote: string;
}

export interface EnforcementNotice {
  id: string;
  noticeNumber: string;
  issueDate: string;
  violatorName: string;
  violatorType: 'Construction Site' | 'Industrial Stack' | 'Open Waste Burning' | 'Commercial Diesel GenSet' | 'Uncovered Truck Transit';
  location: string;
  city: string;
  lat: number;
  lng: number;
  violationSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  grapCategory: 'GRAP Stage IV' | 'GRAP Stage III' | 'GRAP Stage II' | 'NCAP Norms';
  cpcbClause: string;
  penaltyAmountRupees: number;
  fineDeadlineDays: number;
  legalText: string;
  satelliteProofUrl?: string;
  status: 'ISSUED' | 'SERVED' | 'COMPLIED' | 'PENALTY_LEVIED';
  assignedOfficer: string;
}

export interface PolicyParameters {
  oddEvenRule: boolean;
  constructionBanPct: number; // 0 - 100
  evFleetPct: number; // 0 - 100
  stubbleBurningReductionPct: number; // 0 - 100
  industrialScrubberPct: number; // 0 - 100
  publicTransitFreqIncreasePct: number; // 0 - 100
}

export interface PolicySimulationResult {
  currentAqi: number;
  projectedAqi: number;
  aqiDelta: number; // negative means reduction
  aqiPercentageReduction: number;
  livesSavedYearly: number;
  economicSavingsCroresMonthly: number;
  respiratoryErVisitsPreventedMonthly: number;
  categoryBefore: AQICategory;
  categoryAfter: AQICategory;
  feasibilityScore: number; // 0 - 100
  breakdownByIntervention: Array<{
    name: string;
    aqiReduction: number;
    costImpactCrores: number;
  }>;
}

export interface WardAdvisory {
  wardName: string;
  pincode: string;
  city: string;
  aqi: number;
  category: AQICategory;
  vulnerableGroups: {
    schools: { count: number; advice: string };
    hospitals: { count: number; advice: string };
    elderly: { count: number; advice: string };
    outdoorWorkers: { count: number; advice: string };
  };
  language: string;
  translatedText: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  pincode?: string;
  mediaUrl?: string;
  buttons?: string[];
  status?: 'sent' | 'delivered' | 'read';
}

export interface SatelliteHotspot {
  id: string;
  lat: number;
  lng: number;
  locationName: string;
  city: string;
  no2ColumnDensity: number; // 10^15 molec/cm^2
  intensity: 'HIGH' | 'EXTREME' | 'MODERATE';
  sourceType: 'Industrial Cluster' | 'Thermal Power Plant' | 'Traffic Corridor' | 'Agricultural Burning';
  copernicusPassTime: string;
}

export interface AccuracyMetric {
  city: string;
  date: string;
  forecastAqi: number;
  actualAqi: number;
  mae: number;
  rmse: number;
  accuracyPct: number;
}

export interface HealthCorrelationPoint {
  month: string;
  aqi: number;
  respiratoryAdmissions: number;
  asthmaErVisits: number;
  cardiovascularAlerts: number;
  economicCostCrores: number;
}

export interface IndianLanguage {
  code: string;
  name: string;
  nativeName: string;
}
