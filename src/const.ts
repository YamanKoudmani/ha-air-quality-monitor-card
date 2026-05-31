import type { SeverityInfo, SeverityLevel } from './types';

export const CARD_VERSION = '2.5.1';
export const CARD_TAG = 'air-quality-monitor-card';
export const EDITOR_TAG = 'air-quality-monitor-card-editor';

export const DEFAULT_COLUMNS = 2;
export const DEFAULT_SPARKLINE_HOURS = 24;
export const DEFAULT_SHOW_SPARKLINES = true;
export const DEFAULT_COMPACT = false;
export const DEFAULT_SMOOTH_SPARKLINES = false;
export const DEFAULT_STEP_SPARKLINES = true;

/** Default severity thresholds for common air quality metrics */
export const DEFAULT_SEVERITIES: Record<string, { min: number; max: number; severity: Record<string, number> }> = {
  // EPA AQI 2024 breakpoints (24-hour, µg/m³)
  pm25: {
    min: 0,
    max: 150,
    severity: { good: 9, moderate: 35.4, unhealthy_sensitive: 55.4, unhealthy: 150 },
  },
  // EPA AQI breakpoints (24-hour, µg/m³)
  pm10: {
    min: 0,
    max: 300,
    severity: { good: 54, moderate: 154, unhealthy_sensitive: 254, unhealthy: 300 },
  },
  // No official EPA/WHO PM1 standard; thresholds scaled from PM2.5
  pm1: {
    min: 0,
    max: 75,
    severity: { good: 8, moderate: 20, unhealthy_sensitive: 35, unhealthy: 75 },
  },
  // Indoor air quality (ppm) — ASHRAE 62.1 / WELL
  co2: {
    min: 400,
    max: 5000,
    severity: { good: 800, moderate: 1500, unhealthy_sensitive: 2000, unhealthy: 5000 },
  },
  // TVOC (µg/m³) — WELL / LEED indoor air quality
  voc: {
    min: 0,
    max: 2000,
    severity: { good: 500, moderate: 1000, unhealthy_sensitive: 1500, unhealthy: 2000 },
  },
  // Formaldehyde (µg/m³) — WHO indoor air quality guideline 0.1 mg/m³ = 100 µg/m³ (30-min)
  hcho: {
    min: 0,
    max: 500,
    severity: { good: 50, moderate: 100, unhealthy_sensitive: 200, unhealthy: 500 },
  },
  // Temperature (°C) — comfort range
  temperature: {
    min: 0,
    max: 50,
    severity: { good: 26, moderate: 30, unhealthy_sensitive: 35, unhealthy: 50 },
  },
  // Relative humidity (%)
  humidity: {
    min: 0,
    max: 100,
    severity: { good: 60, moderate: 70, unhealthy_sensitive: 80, unhealthy: 100 },
  },
};

/** Severity level colors (EPA AQI-inspired) */
export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  good: '#4caf50',
  moderate: '#ffeb3b',
  unhealthy_sensitive: '#ff9800',
  unhealthy: '#f44336',
  very_unhealthy: '#9c27b0',
  hazardous: '#7e0023',
  unknown: '#9e9e9e',
};

/** Severity level labels */
export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  good: 'Good',
  moderate: 'Moderate',
  unhealthy_sensitive: 'Sensitive',
  unhealthy: 'Unhealthy',
  very_unhealthy: 'Very Unhealthy',
  hazardous: 'Hazardous',
  unknown: 'Unknown',
};

/** Ordered severity levels (worst to best for threshold comparison) */
export const SEVERITY_ORDER: SeverityLevel[] = [
  'hazardous',
  'very_unhealthy',
  'unhealthy',
  'unhealthy_sensitive',
  'moderate',
  'good',
];

/** Ordered severity levels (best to worst) — used by getSeverity to find the first matching threshold */
export const SEVERITY_ORDER_ASC: SeverityLevel[] = [...SEVERITY_ORDER].reverse() as SeverityLevel[];

/** Default icons for common entity types */
export const DEFAULT_ICONS: Record<string, string> = {
  pm25: 'mdi:air-filter',
  pm10: 'mdi:air-filter',
  pm1: 'mdi:air-filter',
  co2: 'mdi:molecule-co2',
  voc: 'mdi:flask-outline',
  hcho: 'mdi:chemical-weapon',
  temperature: 'mdi:thermometer',
  humidity: 'mdi:water-percent',
  aqi: 'mdi:weather-hazy',
  no2: 'mdi:molecule',
  o3: 'mdi:molecule',
  so2: 'mdi:molecule',
  co: 'mdi:molecule-co',
  formaldehyde: 'mdi:chemical-weapon',
};

/** Get severity info for a value given thresholds */
export function getSeverity(value: number | null, severity?: Record<string, number>): SeverityInfo {
  if (value === null || value === undefined || isNaN(value)) {
    return { level: 'unknown', label: SEVERITY_LABELS.unknown, color: SEVERITY_COLORS.unknown };
  }

  if (severity) {
    // Iterate best-to-worst: return the first level whose threshold the value meets or exceeds.
    for (const level of SEVERITY_ORDER_ASC) {
      const threshold = severity[level];
      if (threshold !== undefined && value <= threshold) {
        return { level, label: SEVERITY_LABELS[level], color: SEVERITY_COLORS[level] };
      }
    }
    // Value exceeds all thresholds — return the worst defined level
    const worstLevel = SEVERITY_ORDER.find(l => severity[l] !== undefined) || 'unknown';
    return { level: worstLevel as SeverityLevel, label: SEVERITY_LABELS[worstLevel as SeverityLevel], color: SEVERITY_COLORS[worstLevel as SeverityLevel] };
  }

  return { level: 'unknown', label: SEVERITY_LABELS.unknown, color: SEVERITY_COLORS.unknown };
}

/** Guess metric type from entity_id */
export function guessMetricType(entityId: string): string {
  const lower = entityId.toLowerCase();
  if (lower.includes('pm25') || lower.includes('pm2.5') || lower.includes('pm2_5')) return 'pm25';
  if (lower.includes('pm10')) return 'pm10';
  if (lower.includes('pm1') && !lower.includes('pm10') && !lower.includes('pm25') && !lower.includes('pm2')) return 'pm1';
  if (lower.includes('co2') || lower.includes('carbon_dioxide')) return 'co2';
  if (lower.includes('voc') || lower.includes('volatile')) return 'voc';
  if (lower.includes('hcho') || lower.includes('formaldehyde')) return 'hcho';
  // Avoid false positives like "template" or "template_sensor" matching "temp"
  if (
    lower.includes('temp') &&
    !lower.includes('template') &&
    !lower.includes('tempo')
  ) return 'temperature';
  if (lower.includes('humid')) return 'humidity';
  if (lower.includes('aqi') || lower.includes('air_quality')) return 'aqi';
  if (lower.includes('no2') || lower.includes('nitrogen')) return 'no2';
  if (lower.includes('o3') || lower.includes('ozone')) return 'o3';
  if (lower.includes('co') && !lower.includes('co2')) return 'co';
  return '';
}

/** Get default icon for an entity */
export function getDefaultIcon(entityId: string): string {
  const type = guessMetricType(entityId);
  return DEFAULT_ICONS[type] || 'mdi:gauge';
}

/** Get default severity and range for an entity */
export function getDefaultSeverityForEntity(entityId: string): { min: number; max: number; severity: Record<string, number> } | undefined {
  const type = guessMetricType(entityId);
  return DEFAULT_SEVERITIES[type];
}
