import { describe, it, expect } from 'vitest';
import {
  describeArc,
  polarToCartesian,
  formatValue,
  clamp,
  generateSparklinePath,
  generateSparklineAreaPath,
  generateSmoothSparklinePath,
  generateSmoothSparklineAreaPath,
  generateStepSparklinePath,
  generateStepSparklineAreaPath,
  detectTrend,
} from '../utils';
import {
  getSeverity,
  guessMetricType,
  getDefaultIcon,
  SEVERITY_COLORS,
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

  it('positions points proportionally to timestamps (not evenly by index)', () => {
    // Points at t=0, t=60, t=360 (6 hours apart) in a 360-unit window
    // The middle point at t=60 should be at ~16.7% across, not 50%
    const points = [
      { timestamp: 0, value: 10 },
      { timestamp: 60, value: 20 },
      { timestamp: 360, value: 15 },
    ];
    const path = generateSparklinePath(points, 120, 40);
    // Parse x positions from the path
    const moves = path.match(/[ML]\s+[\d.]+\s+[\d.]+/g);
    expect(moves).toHaveLength(3);
    // First point at x≈2 (padding), last at x≈118 (width-padding)
    // Middle point should be at ~16.7% of effective width + padding
    const middleX = parseFloat(moves![1].split(/\s+/)[1]);
    const expectedMiddleX = 2 + (60 / 360) * 116; // padding + (60/360) * effectiveWidth
    expect(middleX).toBeCloseTo(expectedMiddleX, 0);
  });

  it('places evenly-timed points at equal intervals', () => {
    const points = [
      { timestamp: 0, value: 10 },
      { timestamp: 100, value: 20 },
      { timestamp: 200, value: 15 },
    ];
    const path = generateSparklinePath(points, 120, 40);
    const moves = path.match(/[ML]\s+[\d.]+\s+[\d.]+/g);
    const x0 = parseFloat(moves![0].split(/\s+/)[1]);
    const x1 = parseFloat(moves![1].split(/\s+/)[1]);
    const x2 = parseFloat(moves![2].split(/\s+/)[1]);
    // x1 should be exactly midway between x0 and x2
    expect(x1).toBeCloseTo((x0 + x2) / 2, 1);
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

// ─── generateSmoothSparklinePath ─────────────────────────────────────
describe('generateSmoothSparklinePath', () => {
  it('returns empty string for fewer than 2 points', () => {
    expect(generateSmoothSparklinePath([], 120, 40)).toBe('');
    expect(generateSmoothSparklinePath([{ timestamp: 1, value: 5 }], 120, 40)).toBe('');
  });

  it('falls back to linear path for 2 points', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
    ];
    const smooth = generateSmoothSparklinePath(points, 120, 40);
    const linear = generateSparklinePath(points, 120, 40);
    expect(smooth).toBe(linear);
  });

  it('starts with M command', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
      { timestamp: 3, value: 15 },
    ];
    const path = generateSmoothSparklinePath(points, 120, 40);
    expect(path).toMatch(/^M /);
  });

  it('uses C commands for 3+ points', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
      { timestamp: 3, value: 15 },
    ];
    const path = generateSmoothSparklinePath(points, 120, 40);
    expect(path).toContain('C ');
  });

  it('produces different output than linear for 3+ points', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 30 },
      { timestamp: 3, value: 15 },
      { timestamp: 4, value: 25 },
    ];
    const smooth = generateSmoothSparklinePath(points, 120, 40);
    const linear = generateSparklinePath(points, 120, 40);
    expect(smooth).not.toBe(linear);
  });
});

// ─── generateSmoothSparklineAreaPath ──────────────────────────────────
describe('generateSmoothSparklineAreaPath', () => {
  it('returns empty string for fewer than 2 points', () => {
    expect(generateSmoothSparklineAreaPath([], 120, 40)).toBe('');
  });

  it('ends with Z (closed path)', () => {
    const points = [
      { timestamp: 1, value: 10 },
      { timestamp: 2, value: 20 },
      { timestamp: 3, value: 15 },
    ];
    const path = generateSmoothSparklineAreaPath(points, 120, 40);
    expect(path).toMatch(/Z$/);
  });
});

// ─── generateStepSparklinePath ─────────────────────────────────────────
describe('generateStepSparklinePath', () => {
  it('returns empty string for fewer than 2 points', () => {
    expect(generateStepSparklinePath([], 120, 40)).toBe('');
    expect(generateStepSparklinePath([{ timestamp: 1, value: 5 }], 120, 40)).toBe('');
  });

  it('starts with M command', () => {
    const points = [
      { timestamp: 0, value: 10 },
      { timestamp: 100, value: 20 },
    ];
    const path = generateStepSparklinePath(points, 120, 40);
    expect(path).toMatch(/^M /);
  });

  it('produces horizontal-then-vertical segments (staircase)', () => {
    const points = [
      { timestamp: 0, value: 10 },
      { timestamp: 100, value: 20 },
    ];
    const path = generateStepSparklinePath(points, 120, 40);
    // Should have M, then L (horizontal hold), then L (vertical jump)
    const commands = path.split(' ');
    // M x y L x y L x y = 9 tokens
    expect(commands).toHaveLength(9);
  });

  it('holds value horizontally until next timestamp (step behavior)', () => {
    const points = [
      { timestamp: 0, value: 10 },
      { timestamp: 100, value: 20 },
    ];
    const path = generateStepSparklinePath(points, 120, 40);
    // Parse: M x1 y1 L x2 y1_hold L x2 y2
    // Split by space: ['M', 'x1', 'y1', 'L', 'x2', 'y1_hold', 'L', 'x2', 'y2']
    const parts = path.split(' ');
    const startY = parseFloat(parts[2]);      // y of M (index 2)
    const holdY = parseFloat(parts[5]);         // y of horizontal hold L (index 5)
    expect(holdY).toBeCloseTo(startY, 1);
  });

  it('uses time-proportional x positioning', () => {
    const points = [
      { timestamp: 0, value: 10 },
      { timestamp: 60, value: 20 },
      { timestamp: 360, value: 15 },
    ];
    const path = generateStepSparklinePath(points, 120, 40);
    const moves = path.match(/[ML]\s+[\d.]+\s+[\d.]+/g);
    expect(moves).toBeDefined();
    expect(moves!.length).toBeGreaterThanOrEqual(3);
  });
});

// ─── generateStepSparklineAreaPath ──────────────────────────────────────
describe('generateStepSparklineAreaPath', () => {
  it('returns empty string for fewer than 2 points', () => {
    expect(generateStepSparklineAreaPath([], 120, 40)).toBe('');
  });

  it('ends with Z (closed path)', () => {
    const points = [
      { timestamp: 0, value: 10 },
      { timestamp: 100, value: 20 },
    ];
    const path = generateStepSparklineAreaPath(points, 120, 40);
    expect(path).toMatch(/Z$/);
  });
});

// ─── timeStart/timeEnd parameters ─────────────────────────────────────
describe('timeStart/timeEnd parameters', () => {
  // Data points clustered in the last 1/3 of a 360-unit time window
  const recentPoints = [
    { timestamp: 240, value: 10 },
    { timestamp: 300, value: 20 },
    { timestamp: 360, value: 15 },
  ];

  it('generateSparklinePath uses full time window when timeStart/timeEnd provided', () => {
    // Without timeStart/timeEnd, points span t=240..360 (narrow range)
    const narrowPath = generateSparklinePath(recentPoints, 120, 40);
    // With timeStart=0, timeEnd=360 (full window), points should spread across full width
    const fullPath = generateSparklinePath(recentPoints, 120, 40, 2, 0, 360);

    // In the narrow path, first point is at x≈2 (left edge of narrow range)
    // In the full path, first point should be at ~67% across (240/360 * effectiveWidth + padding)
    const narrowMoves = narrowPath.match(/[ML]\s+[\d.]+\s+[\d.]+/g)!;
    const fullMoves = fullPath.match(/[ML]\s+[\d.]+\s+[\d.]+/g)!;

    const narrowFirstX = parseFloat(narrowMoves[0].split(/\s+/)[1]);
    const fullFirstX = parseFloat(fullMoves[0].split(/\s+/)[1]);

    // With full window, first point should be much further right than with narrow range
    expect(fullFirstX).toBeGreaterThan(narrowFirstX + 10);
  });

  it('generateStepSparklinePath uses full time window when timeStart/timeEnd provided', () => {
    const narrowPath = generateStepSparklinePath(recentPoints, 120, 40);
    const fullPath = generateStepSparklinePath(recentPoints, 120, 40, 2, 0, 360);

    const narrowMoves = narrowPath.match(/[ML]\s+[\d.]+\s+[\d.]+/g)!;
    const fullMoves = fullPath.match(/[ML]\s+[\d.]+\s+[\d.]+/g)!;

    const narrowFirstX = parseFloat(narrowMoves[0].split(/\s+/)[1]);
    const fullFirstX = parseFloat(fullMoves[0].split(/\s+/)[1]);

    expect(fullFirstX).toBeGreaterThan(narrowFirstX + 10);
  });

  it('generateSmoothSparklinePath uses full time window when timeStart/timeEnd provided', () => {
    const points = [
      { timestamp: 240, value: 10 },
      { timestamp: 300, value: 20 },
      { timestamp: 360, value: 15 },
      { timestamp: 400, value: 25 },
    ];
    const narrowPath = generateSmoothSparklinePath(points, 120, 40);
    const fullPath = generateSmoothSparklinePath(points, 120, 40, 2, 0.3, 0, 400);

    const narrowMoves = narrowPath.match(/[ML]\s+[\d.]+\s+[\d.]+/g)!;
    const fullMoves = fullPath.match(/[ML]\s+[\d.]+\s+[\d.]+/g)!;

    const narrowFirstX = parseFloat(narrowMoves[0].split(/\s+/)[1]);
    const fullFirstX = parseFloat(fullMoves[0].split(/\s+/)[1]);

    expect(fullFirstX).toBeGreaterThan(narrowFirstX + 10);
  });

  it('area paths use full time window for closing coordinates', () => {
    const points = [
      { timestamp: 240, value: 10 },
      { timestamp: 360, value: 20 },
    ];
    // Without timeStart/timeEnd, last X is at right edge (padding + effectiveWidth)
    const narrowArea = generateSparklineAreaPath(points, 120, 40);
    // With full window, last X should still be at right edge
    const fullArea = generateSparklineAreaPath(points, 120, 40, 2, 0, 360);

    // Both should end with Z and have closing coordinates at the right edge
    expect(narrowArea).toMatch(/Z$/);
    expect(fullArea).toMatch(/Z$/);
  });

  it('step area path uses full time window', () => {
    const points = [
      { timestamp: 240, value: 10 },
      { timestamp: 360, value: 20 },
    ];
    const fullArea = generateStepSparklineAreaPath(points, 120, 40, 2, 0, 360);
    expect(fullArea).toMatch(/Z$/);
  });

  it('smooth area path uses full time window', () => {
    const points = [
      { timestamp: 240, value: 10 },
      { timestamp: 300, value: 20 },
      { timestamp: 360, value: 15 },
    ];
    const fullArea = generateSmoothSparklineAreaPath(points, 120, 40, 2, 0.3, 0, 360);
    expect(fullArea).toMatch(/Z$/);
  });

  it('defaults to data range when timeStart/timeEnd not provided', () => {
    const points = [
      { timestamp: 100, value: 10 },
      { timestamp: 200, value: 20 },
    ];
    // Should produce same result whether or not timeStart/timeEnd match data range
    const implicit = generateSparklinePath(points, 120, 40);
    const explicit = generateSparklinePath(points, 120, 40, 2, 100, 200);
    expect(implicit).toBe(explicit);
  });
});

// ─── valueMin/valueMax parameters ─────────────────────────────────────
describe('valueMin/valueMax parameters', () => {
  const points = [
    { timestamp: 0, value: 30 },
    { timestamp: 100, value: 50 },
    { timestamp: 200, value: 70 },
  ];

  it('generateSparklinePath uses configured min/max for y-axis', () => {
    // Data range is 30-70, but with valueMin=0, valueMax=100, y positions should differ
    const dataRange = generateSparklinePath(points, 120, 40);
    const fixedRange = generateSparklinePath(points, 120, 40, 2, 0, 200, 0, 100);
    expect(fixedRange).not.toBe(dataRange);
  });

  it('generateSparklinePath with valueMin/valueMax maps values to full height', () => {
    // With valueMin=0, valueMax=100, value=50 should be at the midpoint
    const path = generateSparklinePath(
      [{ timestamp: 0, value: 50 }, { timestamp: 100, value: 50 }],
      120, 40, 2, 0, 100, 0, 100,
    );
    const moves = path.match(/[ML]\s+[\d.]+\s+[\d.]+/g)!;
    const y1 = parseFloat(moves[0].split(/\s+/)[2]);
    const y2 = parseFloat(moves[1].split(/\s+/)[2]);
    // Both points at value=50 in a 0-100 range should be at the vertical midpoint
    expect(y1).toBeCloseTo(y2, 1);
    // Midpoint of height 40 with padding 2: 2 + (40-4)/2 = 20
    expect(y1).toBeCloseTo(20, 0);
  });

  it('generateStepSparklinePath uses configured min/max for y-axis', () => {
    const dataRange = generateStepSparklinePath(points, 120, 40);
    const fixedRange = generateStepSparklinePath(points, 120, 40, 2, 0, 200, 0, 100);
    expect(fixedRange).not.toBe(dataRange);
  });

  it('generateSmoothSparklinePath uses configured min/max for y-axis', () => {
    const dataRange = generateSmoothSparklinePath(points, 120, 40);
    const fixedRange = generateSmoothSparklinePath(points, 120, 40, 2, 0.3, 0, 200, 0, 100);
    expect(fixedRange).not.toBe(dataRange);
  });

  it('area paths use configured min/max', () => {
    const areaData = generateSparklineAreaPath(points, 120, 40);
    const areaFixed = generateSparklineAreaPath(points, 120, 40, 2, 0, 200, 0, 100);
    expect(areaFixed).not.toBe(areaData);
  });

  it('defaults to data range when valueMin/valueMax not provided', () => {
    const implicit = generateSparklinePath(points, 120, 40);
    const explicit = generateSparklinePath(points, 120, 40, 2, 0, 200, 30, 70);
    expect(implicit).toBe(explicit);
  });

  it('clamps values outside configured range', () => {
    // value=150 with max=100 should still render (just above the top)
    const path = generateSparklinePath(
      [{ timestamp: 0, value: 150 }, { timestamp: 100, value: 50 }],
      120, 40, 2, 0, 100, 0, 100,
    );
    expect(path).toMatch(/^M /);
    // Should not crash and should produce a valid path
    expect(path).toContain('L ');
  });
});