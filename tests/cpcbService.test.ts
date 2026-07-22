import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchLiveCpcbData } from '../src/services/cpcbService';

describe('cpcbService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return valid CpcbApiResponse structure on successful fetch or graceful fallback', async () => {
    const result = await fetchLiveCpcbData();

    expect(result).toHaveProperty('success', true);
    expect(result.cities.length).toBeGreaterThan(0);
    expect(result.stations.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('source');
    expect(typeof result.isStale).toBe('boolean');
    expect(typeof result.lastRefreshed).toBe('string');
  });

  it('should fall back smoothly with isStale: true when API call fails', async () => {
    // Mock global fetch to throw an error
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error simulation'));

    const result = await fetchLiveCpcbData();

    expect(result.success).toBe(true);
    expect(result.isStale).toBe(true);
    expect(result.source).toBe('Cached reference data (live feed unavailable)');
    expect(result.error).toContain('Network error simulation');

    global.fetch = originalFetch;
  });
});
