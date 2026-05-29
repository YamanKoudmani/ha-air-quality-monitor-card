import { describe, it, expect } from 'vitest';
import {
  describeArc,
  polarToCartesian,
  formatValue,
  clamp,
  generateSparklinePath,
  generateSparklineAreaPath,
  detectTrend,
} from '../utils';
import {
  getSeverity,
  guessMetricType,
  getDefaultIcon,
  SEVERITY_COLORS,
  SEVERITY_ORDER,
  DEFAULT_SEVERITIES,
  DEFAULT_COLUMNS,
} from '../const';

// ─── polarToCartesian ────────────────────────────────────────────────
describe('polarToCartesian', () => {
  it('0° (top)', () => {
    const { x, y } = polarToCartesian(60, 38, 28, 0);
    expect(x).toBeCloseTo(60, 1);
    expect(y).toBeCloseTo(10, 1);
  });

  it('90° (right)', () => {
    const { x, y } = polarToCartesian(60, 38, 28, 90);
    expect(x).toBeCloseTo(88, 1);
    expect(y).toBeCloseTo(38, 1);
  });

  it('180° (bottom)', () => {
    const { x, y } = polarToCartesian(60, 38, 28, 180);
    expect(x).toBeCloseTo(60, 1);
    expect(y).toBeCloseTo(66, 1);
  });

  it('270° (left)', () => {
    const { x, y } = polarToCartesian(60, 38, 28, 270);
    expect(x).toBeCloseTo(32, 1);
    expect(y).toBeCloseTo(38, 1);
  });

  it('225° (lower-left, gauge start)', () => {
    const { x, y } = polarToCartesian(60, 38, 28, 225);
    expect(x).toBeCloseTo(40.2, 1);
    expect(y).toBeCloseTo(57.8, 1);
  });

  it('135° (lower-right, gauge end)', () => {
    const { x, y } = polarToCartesian(60, 38, 28, 135);
    expect(x).toBeCloseTo(79.8, 1);
    expect(y).toBeCloseTo(57.8, 1);
  });
});

// ─── describeArc ─────────────────────────────────────────────────────
describe('describeArc', () => {
  it('produces a valid SVG path string', () => {
    const path = describeArc(60, 38, 28, 225, 135);
    expect(path).toMatch(/^M [\d.]+ [\d.]+ A 28 28 0 [01] 1 [\d.]+ [\d.]+$/);
  });

  it('background arc (270° sweep) uses large-arc flag', () => {
    const path = describeArc(60, 38, 28, 225, 135);
    // 270° > 180° → large-arc flag = 1
    expect(path).toContain(' 0 1 1 ');
  });

  it('small arc (< 180°) uses small-arc flag', () => {
    const path = describeArc(60, 38, 28, 225, 270);
    // 45° < 180° → large-arc flag = 0
    expect(path).toContain(' 0 0 1 ');
  });

  it('full circle when start === end', () => {
    const path = describeArc(60, 38, 28, 0, 0);
    // sweep = 0 → treated as 360° → large-arc flag = 1
    expect(path).toContain(' 0 1 1 ');
  });

  it('start point matches polarToCartesian for startAngle', () => {
    const start = polarToCartesian(60, 38, 28, 225);
    const path = describeArc(60, 38, 28, 225, 135);
    const mx = parseFloat(path.split(' ')[1]);
    const my = parseFloat(path.split(' ')[2]);
    expect(mx).toBeCloseTo(start.x, 1);
    expect(my).toBeCloseTo(start.y, 1);
  });
});

// ─── formatValue ─────────────────────────────────────────────────────
describe('formatValue', () => {
  it('formats null as em-dash', () => {
    expect(formatValue(null)).toBe('—');
  });

  it('formats NaN as em-dash', () => {
    expect(formatValue(NaN)).toBe('—');
  });

  it('formats integers without decimals', () => {
    expect(formatValue(1735)).toBe('1735');
  });

  it('formats small numbers with 1 decimal', () => {
    expect(formatValue(5.67)).toBe('5.7');
  });

  it('respects explicit precision', () => {
    expect(formatValue(5.678, 2)).toBe('5.68');
  });

  it('formats zero with 1 decimal (small number rule)', () => {
    expect(formatValue(0)).toBe('0.0');
  });
});

// ─── clamp ────────────────────────────────────────────────────────────
describe('clamp', () => {
  it('clamps to max', () => {
    expect(clamp(10, 0, 5)).toBe(5);
  });

  it('clamps to min', () => {
    expect(clamp(-3, 0, 5)).toBe(0);
  });

  it('returns value within range', () => {
    expect(clamp(3, 0, 5)).toBe(3);
  });
});

// ─── getSeverity ─────────────────────────────────────────────────────
describe('getSeverity', () => {
  const co2Severity = DEFAULT_SEVERITIES.co2!.severity;

  it('returns unknown for null', () => {
    expect(getSeverity(null, co2Severity).level).toBe('unknown');
  });

  it('returns good for low values', () => {
    expect(getSeverity(500, co2Severity).level).toBe('good');
    expect(getSeverity(500, co2Severity).color).toBe(SEVERITY_COLORS.good);
  });

  it('returns moderate for mid-range values', () => {
    expect(getSeverity(1200, co2Severity).level).toBe('moderate');
  });

  it('returns unhealthy_sensitive for higher values', () => {
    expect(getSeverity(1800, co2Severity).level).toBe('unhealthy_sensitive');
  });

  it('returns unhealthy for very high values', () => {
    expect(getSeverity(3000, co2Severity).level).toBe('unhealthy');
  });

  it('returns worst defined level when value exceeds all thresholds', () => {
    const result = getSeverity(9999, co2Severity);
    expect(result.level).toBe('unhealthy');
  });

  it('returns unknown when no severity config provided', () => {
    expect(getSeverity(100).level).toBe('unknown');
  });
});

// ─── guessMetricType ─────────────────────────────────────────────────
describe('guessMetricType', () => {
  it('detects pm25', () => {
    expect(guessMetricType('sensor.pm25')).toBe('pm25');
    expect(guessMetricType('sensor.pm2_5')).toBe('pm25');
  });

  it('detects co2', () => {
    expect(guessMetricType('sensor.co2')).toBe('co2');
    expect(guessMetricType('sensor.carbon_dioxide')).toBe('co2');
  });

  it('detects temperature', () => {
    expect(guessMetricType('sensor.temperature')).toBe('temperature');
    expect(guessMetricType('sensor.temp_outdoor')).toBe('temperature');
  });

  it('detects humidity', () => {
    expect(guessMetricType('sensor.humidity')).toBe('humidity');
  });

  it('returns empty string for unknown', () => {
    expect(guessMetricType('sensor.some_random')).toBe('');
  });
});

// ─── getDefaultIcon ───────────────────────────────────────────────────
describe('getDefaultIcon', () => {
  it('returns specific icon for known types', () => {
    expect(getDefaultIcon('sensor.co2')).toBe('mdi:molecule-co2');
    expect(getDefaultIcon('sensor.temperature')).toBe('mdi:thermometer');
  });

  it('returns generic gauge for unknown', () => {
    expect(getDefaultIcon('sensor.unknown')).toBe('mdi:gauge');
  });
});

// ─── generateSparklinePath ────────────────────────────────────────────
describe('generateSparklinePath', () => {
  it('returns empty string for fewer than 2 points', () => {
    expect(generateSparklinePath([], 120, 40)).toBe('');
    expect(generateSparklinePath([{ timestamp: 1, value: 5 }], 120, 40)).toBe('');
  });

  it('returns a path starting with M', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
    ];
    const path = generateSparklinePath(points, 120, 40);
    expect(path).toMatch(/^M /);
  });

  it('returns a path with L commands', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
    ];
    const path = generateSparklinePath(points, 120, 40);
    expect(path).toContain('L ');
  });
});

// ─── generateSparklineAreaPath ────────────────────────────────────────
describe('generateSparklineAreaPath', () => {
  it('returns empty string for fewer than 2 points', () => {
    expect(generateSparklineAreaPath([], 120, 40)).toBe('');
  });

  it('ends with Z (closed path)', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
    ];
    const path = generateSparklineAreaPath(points, 120, 40);
    expect(path).toMatch(/Z$/);
  });
});

// ─── DEFAULT_COLUMNS ─────────────────────────────────────────────────
describe('DEFAULT_COLUMNS', () => {
  it('defaults to 2 columns', () => {
    expect(DEFAULT_COLUMNS).toBe(2);
  });
});

// ─── Arc length computation (gauge dasharray) ─────────────────────────
describe('Gauge arc length', () => {
  const radius = 28;
  const totalSweep = 270;

  it('computes correct arc length for 270° sweep', () => {
    const arcLength = 2 * Math.PI * radius * (totalSweep / 360);
    // 2 * π * 28 * 0.75 ≈ 131.95
    expect(arcLength).toBeCloseTo(131.95, 1);
  });

  it('dasharray for 50% fill uses half the arc length', () => {
    const arcLength = 2 * Math.PI * radius * (totalSweep / 360);
    const ratio = 0.5;
    const filledLen = ratio * arcLength;
    expect(filledLen).toBeCloseTo(65.97, 1);
  });

  it('dasharray for 0% fill is zero', () => {
    const arcLength = 2 * Math.PI * radius * (totalSweep / 360);
    const ratio = 0;
    const filledLen = ratio * arcLength;
    expect(filledLen).toBe(0);
  });

  it('dasharray for 100% fill equals full arc length', () => {
    const arcLength = 2 * Math.PI * radius * (totalSweep / 360);
    const ratio = 1;
    const filledLen = ratio * arcLength;
    expect(filledLen).toBeCloseTo(arcLength, 1);
  });
});

// ─── detectTrend ──────────────────────────────────────────────────────
describe('detectTrend', () => {
  it('returns stable for empty history', () => {
    expect(detectTrend([]).direction).toBe('stable');
  });

  it('returns stable for single point', () => {
    expect(detectTrend([{ timestamp: 1, value: 10 }]).direction).toBe('stable');
  });

  it('returns stable for flat data', () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ timestamp: i, value: 50 }));
    expect(detectTrend(data).direction).toBe('stable');
  });

  it('returns rising for increasing data', () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ timestamp: i, value: i * 10 }));
    expect(detectTrend(data).direction).toBe('rising');
  });

  it('returns falling for decreasing data', () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ timestamp: i, value: 200 - i * 10 }));
    expect(detectTrend(data).direction).toBe('falling');
  });

  it('returns stable for small fluctuations', () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ timestamp: i, value: 50 + Math.sin(i) }));
    expect(detectTrend(data).direction).toBe('stable');
  });

  it('includes arrow in result', () => {
    expect(detectTrend([]).arrow).toBe('→');
    expect(detectTrend([{ timestamp: 1, value: 10 }]).arrow).toBe('→');
  });
});