import type { HomeAssistant } from 'custom-card-helpers';
import type { HistoryPoint, MetricEntityConfig, MetricData, TrendInfo } from './types';
import { getSeverity, getDefaultIcon, getDefaultSeverityForEntity } from './const';

/** HA history API response entry */
interface HAHistoryEntry {
  state: string;
  last_changed?: string;
  last_updated?: string;
}

/** Fetch entity history from HA */
export async function fetchHistory(
  hass: HomeAssistant,
  entityId: string,
  hours: number,
): Promise<HistoryPoint[]> {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);

  try {
    const history: HAHistoryEntry[][] = await hass.callApi(
      'GET',
      `history/period/${startTime.toISOString()}?filter_entity_id=${entityId}&minimal_response&no_attributes`,
    ) as HAHistoryEntry[][];

    if (!history || !history[0] || history[0].length === 0) {
      return [];
    }

    return history[0]
      .map((entry: HAHistoryEntry) => {
        const value = parseFloat(entry.state);
        if (isNaN(value)) return null;
        const ts = entry.last_changed || entry.last_updated;
        if (!ts) return null;
        return {
          timestamp: new Date(ts).getTime(),
          value,
        } as HistoryPoint;
      })
      .filter((p: HistoryPoint | null): p is HistoryPoint => p !== null);
  } catch {
    return [];
  }
}

/** Resolve a metric config into full data with live state */
export function resolveMetricData(
  config: MetricEntityConfig,
  hass: HomeAssistant,
  history: HistoryPoint[],
): MetricData {
  const entityState = hass.states[config.entity];
  const unavailable = !entityState || entityState.state === 'unavailable' || entityState.state === 'unknown';

  const rawState = entityState?.state ?? '';
  const stateNumeric = rawState !== '' && rawState !== 'unavailable' && rawState !== 'unknown'
    ? parseFloat(rawState)
    : null;

  // Determine unit
  const unit = config.unit
    ?? entityState?.attributes?.unit_of_measurement
    ?? '';

  // Determine name
  const name = config.name
    ?? entityState?.attributes?.friendly_name
    ?? config.entity;

  // Determine icon
  const icon = config.icon
    ?? entityState?.attributes?.icon
    ?? getDefaultIcon(config.entity);

  // Determine severity
  const defaults = getDefaultSeverityForEntity(config.entity);
  const severityThresholds = (config.severity as Record<string, number> | undefined) ?? defaults?.severity;
  const severity = getSeverity(stateNumeric, severityThresholds);

  // Determine min/max
  const min = config.min ?? defaults?.min ?? 0;
  const max = config.max ?? defaults?.max ?? (stateNumeric !== null ? Math.max(stateNumeric * 1.5, 100) : 100);

  return {
    config: {
      ...config,
      min,
      max,
    },
    state: rawState,
    stateNumeric,
    unit,
    name,
    icon,
    severity,
    history,
    unavailable,
  };
}

/** Format a numeric value for display */
export function formatValue(value: number | null, precision?: number): string {
  if (value === null || isNaN(value)) return '—';
  const p = precision ?? (Math.abs(value) < 10 ? 1 : 0);
  return value.toFixed(p);
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Generate SVG arc path for a gauge (clockwise from startAngle to endAngle) */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  // Calculate clockwise sweep from start to end
  let sweep = endAngle - startAngle;
  if (sweep < 0) sweep += 360;
  if (sweep === 0) sweep = 360; // full circle
  const largeArcFlag = sweep > 180 ? '1' : '0';
  // sweep-flag=1 for clockwise
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

/** Map a timestamp to an x position within the sparkline width */
function timestampToX(
  timestamp: number,
  minTime: number,
  maxTime: number,
  effectiveWidth: number,
  padding: number,
): number {
  const timeRange = maxTime - minTime || 1;
  return padding + ((timestamp - minTime) / timeRange) * effectiveWidth;
}

/** Generate SVG sparkline path from history points (time-proportional x-axis) */
export function generateSparklinePath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
  timeStart?: number,
  timeEnd?: number,
  valueMin?: number,
  valueMax?: number,
): string {
  if (points.length < 2) return '';

  const values = points.map(p => p.value);
  const min = valueMin ?? Math.min(...values);
  const max = valueMax ?? Math.max(...values);
  const range = max - min || 1;

  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const minTime = timeStart ?? points[0].timestamp;
  const maxTime = timeEnd ?? points[points.length - 1].timestamp;

  return points
    .map((point, i) => {
      const x = timestampToX(point.timestamp, minTime, maxTime, effectiveWidth, padding);
      const y = padding + effectiveHeight - ((point.value - min) / range) * effectiveHeight;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

/** Generate filled area path for sparkline (time-proportional x-axis) */
export function generateSparklineAreaPath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
  timeStart?: number,
  timeEnd?: number,
  valueMin?: number,
  valueMax?: number,
): string {
  if (points.length < 2) return '';

  const linePath = generateSparklinePath(points, width, height, padding, timeStart, timeEnd, valueMin, valueMax);
  const effectiveWidth = width - padding * 2;
  const minTime = timeStart ?? points[0].timestamp;
  const maxTime = timeEnd ?? points[points.length - 1].timestamp;
  const lastX = timestampToX(maxTime, minTime, maxTime, effectiveWidth, padding);

  return `${linePath} L ${lastX.toFixed(1)} ${height - padding} L ${padding} ${height - padding} Z`;
}

/** Generate smooth SVG sparkline path using Catmull-Rom → cubic Bézier (time-proportional x-axis) */
export function generateSmoothSparklinePath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
  tension: number = 0.3,
  timeStart?: number,
  timeEnd?: number,
  valueMin?: number,
  valueMax?: number,
): string {
  if (points.length < 2) return '';
  if (points.length === 2) return generateSparklinePath(points, width, height, padding, timeStart, timeEnd, valueMin, valueMax);

  const values = points.map(p => p.value);
  const min = valueMin ?? Math.min(...values);
  const max = valueMax ?? Math.max(...values);
  const range = max - min || 1;

  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const minTime = timeStart ?? points[0].timestamp;
  const maxTime = timeEnd ?? points[points.length - 1].timestamp;

  // Convert data points to SVG coordinates (time-proportional x)
  const coords = points.map((point) => ({
    x: timestampToX(point.timestamp, minTime, maxTime, effectiveWidth, padding),
    y: padding + effectiveHeight - ((point.value - min) / range) * effectiveHeight,
  }));

  // Build path using Catmull-Rom → cubic Bézier conversion
  // tension controls how tight the curve is (0 = no smoothing, 1 = very loose)
  const segments: string[] = [`M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`];

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];

    // Catmull-Rom control points scaled by tension
    const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
    const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
    const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
    const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

    segments.push(
      `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    );
  }

  return segments.join(' ');
}

/** Generate smooth filled area path for sparkline (time-proportional x-axis) */
export function generateSmoothSparklineAreaPath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
  tension: number = 0.3,
  timeStart?: number,
  timeEnd?: number,
  valueMin?: number,
  valueMax?: number,
): string {
  if (points.length < 2) return '';

  const linePath = generateSmoothSparklinePath(points, width, height, padding, tension, timeStart, timeEnd, valueMin, valueMax);
  const effectiveWidth = width - padding * 2;
  const minTime = timeStart ?? points[0].timestamp;
  const maxTime = timeEnd ?? points[points.length - 1].timestamp;
  const lastX = timestampToX(maxTime, minTime, maxTime, effectiveWidth, padding);

  return `${linePath} L ${lastX.toFixed(1)} ${height - padding} L ${padding} ${height - padding} Z`;
}

/** Generate step-interpolation sparkline path (time-proportional x-axis)
 *  Each reading holds its value until the next reading, creating a staircase.
 */
export function generateStepSparklinePath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
  timeStart?: number,
  timeEnd?: number,
  valueMin?: number,
  valueMax?: number,
): string {
  if (points.length < 2) return '';

  const values = points.map(p => p.value);
  const min = valueMin ?? Math.min(...values);
  const max = valueMax ?? Math.max(...values);
  const range = max - min || 1;

  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const minTime = timeStart ?? points[0].timestamp;
  const maxTime = timeEnd ?? points[points.length - 1].timestamp;

  const segments: string[] = [];

  for (let i = 0; i < points.length; i++) {
    const x = timestampToX(points[i].timestamp, minTime, maxTime, effectiveWidth, padding);
    const y = padding + effectiveHeight - ((points[i].value - min) / range) * effectiveHeight;

    if (i === 0) {
      segments.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
    } else {
      // Horizontal hold at previous value to current x, then vertical jump
      const prevY = padding + effectiveHeight - ((points[i - 1].value - min) / range) * effectiveHeight;
      segments.push(`L ${x.toFixed(1)} ${prevY.toFixed(1)}`);
      segments.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  }

  return segments.join(' ');
}

/** Generate step-interpolation filled area path for sparkline */
export function generateStepSparklineAreaPath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
  timeStart?: number,
  timeEnd?: number,
  valueMin?: number,
  valueMax?: number,
): string {
  if (points.length < 2) return '';

  const linePath = generateStepSparklinePath(points, width, height, padding, timeStart, timeEnd, valueMin, valueMax);
  const effectiveWidth = width - padding * 2;
  const minTime = timeStart ?? points[0].timestamp;
  const maxTime = timeEnd ?? points[points.length - 1].timestamp;
  const lastX = timestampToX(maxTime, minTime, maxTime, effectiveWidth, padding);

  return `${linePath} L ${lastX.toFixed(1)} ${height - padding} L ${padding} ${height - padding} Z`;
}

/** Detect trend direction from history data using linear regression slope */
export function detectTrend(history: HistoryPoint[]): TrendInfo {
  if (!history || history.length < 2) {
    return { direction: 'stable', label: 'stable', arrow: '→' };
  }

  const n = history.length;

  // Linear regression: y = slope * x + intercept
  // x = index (0..n-1), y = value
  // Uses all data points for a robust trend estimate
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = history[i].value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Threshold: slope * n gives the total change across the dataset.
  // Compare that total change against 5% of the value range (min 1 unit).
  const allValues = history.map(p => p.value);
  const range = Math.max(...allValues) - Math.min(...allValues);
  const totalChange = slope * (n - 1);
  const threshold = Math.max(range * 0.05, 1);

  if (totalChange > threshold) {
    return { direction: 'rising', label: 'rising', arrow: '↑' };
  } else if (totalChange < -threshold) {
    return { direction: 'falling', label: 'falling', arrow: '↓' };
  } else {
    return { direction: 'stable', label: 'stable', arrow: '→' };
  }
}
