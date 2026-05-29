import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatValue } from './utils';
import type { TrendInfo } from './types';

/**
 * Metric panel component (aqm-gauge)
 *
 * Horizontal progress bar design with:
 * - Uppercase label
 * - Large colored value + gray unit
 * - Status row (colored dot + severity label + trend arrow)
 * - Horizontal progress bar with rounded ends
 * - Scale labels (min, mid, max)
 */
@customElement('aqm-gauge')
export class AqmGauge extends LitElement {
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: String }) severityColor = '#9e9e9e';
  @property({ type: String }) severityLabel = '';
  @property({ type: String }) name = '';
  @property({ type: String }) unit = '';
  @property({ type: Boolean }) showUnit = true;
  @property({ type: String }) icon = '';
  @property({ type: Boolean, reflect: true }) unavailable = false;
  @property({ type: Boolean, reflect: true }) compact = false;
  @property({ type: Object }) trend: TrendInfo = { direction: 'stable', label: 'stable', arrow: '→' };

  private get ratio(): number {
    if (this.value === null || this.value === undefined) return 0;
    if (this.max === this.min) return 0;
    const r = (this.value - this.min) / (this.max - this.min);
    return Math.max(0, Math.min(1, r));
  }

  private get midValue(): number {
    return (this.min + this.max) / 2;
  }

  render() {
    const displayValue = this.unavailable ? '—' : formatValue(this.value);
    const barColor = this.unavailable ? '#bdbdbd' : this.severityColor;
    const valueColor = this.unavailable ? 'var(--disabled-text-color, #9e9e9e)' : this.severityColor;
    const labelColor = this.unavailable ? 'var(--disabled-text-color, #9e9e9e)' : 'var(--secondary-text-color)';
    const percentWidth = (this.ratio * 100).toFixed(1);

    return html`
      <div class="metric-panel">
        <!-- Label -->
        <div class="metric-label" style="color: ${labelColor}">${this.name}</div>

        <!-- Value + Unit -->
        <div class="metric-value-row">
          <span class="metric-value" style="color: ${valueColor}">${displayValue}</span>
          ${this.showUnit && this.unit && !this.unavailable
            ? html`<span class="metric-unit" style="color: ${labelColor}">${this.unit}</span>`
            : ''}
        </div>

        <!-- Status row: severity dot + label | trend -->
        <div class="metric-status-row">
          <div class="metric-status-left">
            <span class="status-dot" style="background: ${barColor}"></span>
            <span class="status-label" style="color: ${valueColor}">${this.unavailable ? 'Unavailable' : this.severityLabel}</span>
          </div>
          ${!this.unavailable
            ? html`<div class="metric-trend" style="color: ${labelColor}">${this.trend.arrow} ${this.trend.label}</div>`
            : ''}
        </div>

        <!-- Progress bar -->
        <div class="progress-track">
          <div
            class="progress-fill"
            style="width: ${this.unavailable ? '0%' : percentWidth + '%'}; background: ${barColor}"
          ></div>
        </div>

        <!-- Scale labels -->
        <div class="scale-labels" style="color: ${labelColor}">
          <span>${this.min}</span>
          <span>${this.unavailable ? '—' : formatValue(this.midValue)}</span>
          <span>${this.max}</span>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .metric-panel {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .metric-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      line-height: 1.2;
    }

    .metric-value-row {
      display: flex;
      align-items: baseline;
      gap: 4px;
      line-height: 1;
    }

    .metric-value {
      font-size: 36px;
      font-weight: 700;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      line-height: 1;
    }

    .metric-unit {
      font-size: 14px;
      font-weight: 400;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      line-height: 1;
    }

    .metric-status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      line-height: 1;
    }

    .metric-status-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-label {
      font-weight: 500;
      line-height: 1;
    }

    .metric-trend {
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
    }

    .progress-track {
      width: 100%;
      height: 6px;
      background: var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease, background 0.3s ease;
    }

    .scale-labels {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 400;
      line-height: 1;
      opacity: 0.6;
    }

    /* Compact mode */
    :host([compact]) .metric-value {
      font-size: 28px;
    }

    :host([compact]) .metric-unit {
      font-size: 12px;
    }

    :host([compact]) .metric-label {
      font-size: 10px;
    }

    :host([compact]) .metric-status-row {
      font-size: 11px;
    }

    :host([compact]) .progress-track {
      height: 5px;
    }

    :host([compact]) .scale-labels {
      font-size: 9px;
    }
  `;
}