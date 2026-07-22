import { describe, it, expect } from 'vitest';
import { generate72HourForecast } from '../src/services/forecastingService';

describe('generate72HourForecast', () => {
  it('should return exactly 72 forecast points', () => {
    const forecast = generate72HourForecast('Delhi NCR', 250);
    expect(forecast).toHaveLength(72);
  });

  it('should not contain negative AQI values', () => {
    const forecast = generate72HourForecast('Delhi NCR', 250);
    forecast.forEach((point) => {
      expect(point.aqi).toBeGreaterThanOrEqual(0);
      expect(point.pm25).toBeGreaterThanOrEqual(0);
      expect(point.no2).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have strictly sequential timestamps 1 hour apart', () => {
    const forecast = generate72HourForecast('Delhi NCR', 250);
    for (let i = 1; i < forecast.length; i++) {
      const prevTime = new Date(forecast[i - 1].timestamp).getTime();
      const currTime = new Date(forecast[i].timestamp).getTime();
      const diffMs = currTime - prevTime;
      // Should be 1 hour apart (3,600,000 ms)
      expect(diffMs).toBe(3600000);
    }
  });

  it('should calculate confidence intervals correctly', () => {
    const forecast = generate72HourForecast('Delhi NCR', 250);
    forecast.forEach((point) => {
      expect(point.confidenceLower).toBeLessThanOrEqual(point.aqi);
      expect(point.confidenceUpper).toBeGreaterThanOrEqual(point.aqi);
    });
  });
});
