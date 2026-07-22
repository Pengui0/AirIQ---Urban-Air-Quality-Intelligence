import { CitySummary, StationData, AQICategory, PollutantType } from '../types';
import { INITIAL_CITIES, INITIAL_STATIONS } from '../data/indiaCitiesData';
import { calculateAqiCategory } from './policyService';

export interface CpcbRecord {
  country?: string;
  state?: string;
  city?: string;
  station?: string;
  last_update?: string;
  pollutant_id?: string;
  pollutant_min?: string;
  pollutant_max?: string;
  pollutant_avg?: string;
  pollutant_unit?: string;
}

export interface CpcbApiResponse {
  success: boolean;
  cities: CitySummary[];
  stations: StationData[];
  lastRefreshed: string;
  source: string;
  isStale: boolean;
  error?: string;
}

export async function fetchLiveCpcbData(): Promise<CpcbApiResponse> {
  const lastRefreshed = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const apiKey = process.env.CPCB_API_KEY;
  const resourceId = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';
  console.log('[CPCB Debug] key length:', apiKey?.length, '| preview:', JSON.stringify(apiKey?.slice(0, 6) + '...' + apiKey?.slice(-4)));

  if (!apiKey) {
    throw new Error('CPCB_API_KEY not set in environment');
  }

  const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=1000`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`data.gov.in CPCB API returned HTTP ${res.status}: ${res.statusText} — ${body.slice(0, 300)}`);
    }

    const data = await res.json();
    const records: CpcbRecord[] = data?.records || [];

    if (!records || records.length === 0) {
      console.error('[CPCB Raw Response]', JSON.stringify(data).slice(0, 1000));
      throw new Error('CPCB API response contained no records');
    }

    // Process live CPCB records
    const stationMap = new Map<string, {
      name: string;
      city: string;
      state: string;
      lastUpdated: string;
      pollutants: Record<string, number>;
    }>();

    for (const rec of records) {
      if (!rec.station) continue;

      const stationKey = rec.station.trim();
      const avgVal = parseFloat(rec.pollutant_avg || '0');

      if (!stationMap.has(stationKey)) {
        stationMap.set(stationKey, {
          name: stationKey,
          city: rec.city?.trim() || 'Delhi NCR',
          state: rec.state?.trim() || 'Delhi',
          lastUpdated: rec.last_update || new Date().toISOString(),
          pollutants: {},
        });
      }

      const entry = stationMap.get(stationKey)!;
      if (rec.pollutant_id && !isNaN(avgVal) && avgVal >= 0) {
        entry.pollutants[rec.pollutant_id.toUpperCase()] = avgVal;
      }
    }

    // Update stations array by merging live data into INITIAL_STATIONS or creating live stations
    const updatedStations: StationData[] = INITIAL_STATIONS.map((baseStation) => {
      // Find matching station entry in live map
      const matched = Array.from(stationMap.values()).find(
        (st) =>
          st.name.toLowerCase().includes(baseStation.name.toLowerCase()) ||
          baseStation.name.toLowerCase().includes(st.name.toLowerCase())
      );

      if (matched && Object.keys(matched.pollutants).length > 0) {
        const pm25 = matched.pollutants['PM2.5'] ?? baseStation.pm25;
        const pm10 = matched.pollutants['PM10'] ?? baseStation.pm10;
        const no2 = matched.pollutants['NO2'] ?? baseStation.no2;
        const so2 = matched.pollutants['SO2'] ?? baseStation.so2;
        const co = matched.pollutants['CO'] ?? baseStation.co;
        const o3 = matched.pollutants['O3'] ?? baseStation.o3;

        // AQI estimate based on highest pollutant standard or PM2.5 / PM10
        const computedAqi = Math.max(
          Math.round(pm25 * 1.5),
          Math.round(pm10 * 0.8),
          baseStation.aqi
        );

        return {
          ...baseStation,
          aqi: computedAqi,
          pm25,
          pm10,
          no2,
          so2,
          co,
          o3,
          category: calculateAqiCategory(computedAqi),
          lastUpdated: matched.lastUpdated || baseStation.lastUpdated,
          isStale: false,
          source: 'CPCB CAAQMS',
        };
      }

      return baseStation;
    });

    // Compute updated city summaries from stations
    const updatedCities: CitySummary[] = INITIAL_CITIES.map((city) => {
      const cityStations = updatedStations.filter(
        (s) => s.city.toLowerCase() === city.name.toLowerCase()
      );

      if (cityStations.length > 0) {
        const avgAqi = Math.round(
          cityStations.reduce((sum, s) => sum + s.aqi, 0) / cityStations.length
        );

        return {
          ...city,
          avgAqi,
          category: calculateAqiCategory(avgAqi),
          emergencyAlert: avgAqi > 200,
        };
      }

      return city;
    });

    return {
      success: true,
      cities: updatedCities,
      stations: updatedStations,
      lastRefreshed,
      source: 'CPCB CAAQMS Real-Time Feed (data.gov.in)',
      isStale: false,
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown network or parsing error';
    console.error(`[CPCB Live Feed Error] ${errorMsg}. Falling back to reference cache.`);

    // Return reference cache with clear isStale flag and accurate source label
    return {
      success: true,
      cities: INITIAL_CITIES,
      stations: INITIAL_STATIONS.map((s) => ({
        ...s,
        isStale: true,
      })),
      lastRefreshed,
      source: 'Cached reference data (live feed unavailable)',
      isStale: true,
      error: errorMsg,
    };
  }
}
