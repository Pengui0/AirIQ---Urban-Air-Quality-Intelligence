import { describe, it, expect } from 'vitest';
import { simulatePolicyImpact, calculateAqiCategory } from '../src/services/policyService';

describe('policyService', () => {
  describe('calculateAqiCategory', () => {
    it('should map numerical AQI to standard CPCB categories', () => {
      expect(calculateAqiCategory(30)).toBe('Good');
      expect(calculateAqiCategory(80)).toBe('Satisfactory');
      expect(calculateAqiCategory(150)).toBe('Moderate');
      expect(calculateAqiCategory(250)).toBe('Poor');
      expect(calculateAqiCategory(350)).toBe('Very Poor');
      expect(calculateAqiCategory(420)).toBe('Severe');
      expect(calculateAqiCategory(480)).toBe('Severe Plus');
    });
  });

  describe('simulatePolicyImpact', () => {
    it('should return valid simulation result shape', () => {
      const result = simulatePolicyImpact(300, {
        oddEvenRule: true,
        constructionBanPct: 50,
        evFleetPct: 20,
        stubbleBurningReductionPct: 30,
        industrialScrubberPct: 20,
        publicTransitFreqIncreasePct: 15,
      });

      expect(result).toHaveProperty('currentAqi', 300);
      expect(result).toHaveProperty('projectedAqi');
      expect(result).toHaveProperty('aqiDelta');
      expect(result).toHaveProperty('livesSavedYearly');
      expect(result).toHaveProperty('economicSavingsCroresMonthly');
      expect(result.breakdownByIntervention).toBeInstanceOf(Array);
      expect(result.breakdownByIntervention.length).toBeGreaterThan(0);
    });

    it('should show lower projected AQI when interventions are active', () => {
      const baseAqi = 300;
      const noPolicy = simulatePolicyImpact(baseAqi, {
        oddEvenRule: false,
        constructionBanPct: 0,
        evFleetPct: 0,
        stubbleBurningReductionPct: 0,
        industrialScrubberPct: 0,
        publicTransitFreqIncreasePct: 0,
      });

      const activePolicy = simulatePolicyImpact(baseAqi, {
        oddEvenRule: true,
        constructionBanPct: 100,
        evFleetPct: 50,
        stubbleBurningReductionPct: 50,
        industrialScrubberPct: 50,
        publicTransitFreqIncreasePct: 50,
      });

      expect(activePolicy.projectedAqi).toBeLessThan(noPolicy.projectedAqi);
      expect(activePolicy.aqiDelta).toBeLessThan(0); // Reduction
      expect(activePolicy.livesSavedYearly).toBeGreaterThan(0);
      expect(activePolicy.economicSavingsCroresMonthly).toBeGreaterThan(0);
    });
  });
});
