import type { HomeAssistant } from 'custom-card-helpers';
import type { HistoryPoint, MetricEntityConfig, MetricData, SeverityInfo } from './types';
import { getSeverity, getDefaultIcon, getDefaultSeverityForEntity } from './const';

/** Fetch entity history from HA */
export async function fetchHistory(
  hass: HomeAssistant,
  entityId: string,
  hours: number,
): Promise<HistoryPoint[]> {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);

  try {
    const history: any[][] = await hass.callApi('GET',
      `history/period/${startTime.toISOString()}?filter_entity_id=${entityId}&minimal_response&no_attributes`,
    ) as any;

    if (!history || !history[0] || history[0].length === 0) {
      return [];
    }

    return history[0]
      .map((entry: any) => {
        const value = parseFloat(entry.state);
        if (isNaN(value)) return null;
        return {
          timestamp: new Date(entry.last_changed || entry.last_updated).getTime(),
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

/** Generate SVG sparkline path from history points */
export function generateSparklinePath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
): string {
  if (points.length < 2) return '';

  const values = points.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const stepX = effectiveWidth / (points.length - 1);

  return points
    .map((point, i) => {
      const x = padding + i * stepX;
      const y = padding + effectiveHeight - ((point.value - min) / range) * effectiveHeight;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

/** Generate filled area path for sparkline */
export function generateSparklineAreaPath(
  points: HistoryPoint[],
  width: number,
  height: number,
  padding: number = 2,
): string {
  if (points.length < 2) return '';

  const linePath = generateSparklinePath(points, width, height, padding);
  const effectiveWidth = width - padding * 2;
  const stepX = effectiveWidth / (points.length - 1);
  const lastX = padding + (points.length - 1) * stepX;

  return `${linePath} L ${lastX.toFixed(1)} ${height - padding} L ${padding} ${height - padding} Z`;
}

/** Debounce function */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
