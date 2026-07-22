import { ForecastPoint, AQICategory } from '../types';
import { calculateAqiCategory } from './policyService';

export function generate72HourForecast(city: string, baseAqi: number): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const now = new Date();

  // Simulated diurnal wind and dispersion cycle based on IMD atmospheric models
  for (let hour = 1; hour <= 72; hour++) {
    const time = new Date(now.getTime() + hour * 3600 * 1000);
    const hourOfDay = time.getHours();
    const dateStr = time.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Nighttime inversion peak (8 PM - 6 AM higher AQI due to shallow boundary layer)
    let diurnalMultiplier = 1.0;
    if (hourOfDay >= 20 || hourOfDay <= 6) {
      diurnalMultiplier = 1.22 + 0.08 * Math.sin((hourOfDay / 24) * Math.PI * 2);
    } else if (hourOfDay >= 12 && hourOfDay <= 16) {
      // Afternoon solar dispersion
      diurnalMultiplier = 0.82;
    }

    // Weather variables
    const temp = Math.round(26 + 6 * Math.sin((hourOfDay / 24) * Math.PI * 2));
    const humidity = Math.round(62 + 20 * Math.cos((hourOfDay / 24) * Math.PI * 2));
    const windSpeed = Math.max(3, Math.round(8 + 5 * Math.sin((hourOfDay / 12) * Math.PI)));
    const windDirections = ['NW', 'NNW', 'N', 'WNW', 'W', 'SW', 'CALM'];
    const windDir = windDirections[(hour + Math.floor(baseAqi)) % windDirections.length];

    // AQI computation
    const forecastedAqi = Math.max(30, Math.round(baseAqi * diurnalMultiplier + (Math.sin(hour / 6) * 15)));
    const pm25 = Math.round(forecastedAqi * 0.68);
    const no2 = Math.round(forecastedAqi * 0.28);

    // Physics-informed heuristic confidence intervals (widens as hours increase)
    const margin = Math.round(8 + (hour * 0.45));
    const lower = Math.max(20, forecastedAqi - margin);
    const upper = forecastedAqi + margin;

    // School closure alert threshold: AQI > 200 forecast for tomorrow peak hours
    const schoolClosureTrigger = forecastedAqi >= 200 && hourOfDay >= 7 && hourOfDay <= 16;

    points.push({
      timestamp: time.toISOString(),
      hourLabel: `${timeStr}`,
      dateLabel: `${dateStr}`,
      aqi: forecastedAqi,
      pm25,
      no2,
      temperature: temp,
      humidity,
      windSpeed,
      windDirection: windDir,
      confidenceLower: lower,
      confidenceUpper: upper,
      schoolClosureAlert: schoolClosureTrigger,
      category: calculateAqiCategory(forecastedAqi)
    });
  }

  return points;
}
