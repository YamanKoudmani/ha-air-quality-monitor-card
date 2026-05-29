import { ActionConfig, LovelaceCardConfig } from 'custom-card-helpers';

/** Severity thresholds for a metric — values define upper bounds for each level */
export interface SeverityConfig {
  good?: number;
  moderate?: number;
  unhealthy_sensitive?: number;
  unhealthy?: number;
  very_unhealthy?: number;
  hazardous?: number;
}

/** Configuration for a single metric entity */
export interface MetricEntityConfig {
  entity: string;
  name?: string;
  icon?: string;
  unit?: string;
  min?: number;
  max?: number;
  severity?: SeverityConfig;
  color?: string;
  precision?: number;
  show_sparkline?: boolean;
  show_unit?: boolean;
}

/** Main card configuration */
export interface AirQualityCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  entities: MetricEntityConfig[];
  columns?: number;
  show_sparklines?: boolean;
  sparkline_hours?: number;
  compact?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}

/** Severity level enum */
export type SeverityLevel = 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous' | 'unknown';

/** Severity level display info */
export interface SeverityInfo {
  level: SeverityLevel;
  label: string;
  color: string;
}

/** History data point */
export interface HistoryPoint {
  timestamp: number;
  value: number;
}

/** Resolved metric data (config + live state + history) */
export interface MetricData {
  config: MetricEntityConfig;
  state: string;
  stateNumeric: number | null;
  unit: string;
  name: string;
  icon: string;
  severity: SeverityInfo;
  history: HistoryPoint[];
  unavailable: boolean;
}
