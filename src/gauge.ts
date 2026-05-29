import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { describeArc, formatValue } from './utils';

/**
 * Circular arc gauge component (aqm-gauge)
 *
 * Speedometer-style arc: 270° sweep with 90° gap at the bottom.
 * Arc goes clockwise from lower-left (225°) through top to lower-right (135°).
 *
 * The filled portion uses stroke-dasharray with the computed arc length
 * to reliably show the progress arc.
 */
@customElement('aqm-gauge')
export class AqmGauge extends LitElement {
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: String }) severityColor = '#9e9e9e';
  @property({ type: String }) name = '';
  @property({ type: String }) unit = '';
  @property({ type: Boolean }) showUnit = true;
  @property({ type: String }) icon = '';
  @property({ type: Boolean, reflect: true }) unavailable = false;
  @property({ type: Boolean, reflect: true }) compact = false;

  // Gauge geometry
  // Convention: 0°=top, 90°=right, 180°=bottom, 270°=left, clockwise
  // Arc: 225° (lower-left) → clockwise → 135° (lower-right) = 270° sweep, 90° gap at bottom
  private readonly cx = 60;
  private readonly cy = 38;
  private readonly radius = 28;
  private readonly arcStart = 225;
  private readonly arcEnd = 135;
  private readonly totalSweep = 270;
  private readonly strokeWidth = 7;

  private get ratio(): number {
    if (this.value === null || this.value === undefined) return 0;
    if (this.max === this.min) return 0;
    const r = (this.value - this.min) / (this.max - this.min);
    return Math.max(0, Math.min(1, r));
  }

  /** Total arc length of the 270° gauge arc */
  private get arcLength(): number {
    return 2 * Math.PI * this.radius * (this.totalSweep / 360);
  }

  private get arcPath(): string {
    return describeArc(this.cx, this.cy, this.radius, this.arcStart, this.arcEnd);
  }

  render() {
    const displayValue = this.unavailable ? '—' : formatValue(this.value);
    const arcColor = this.unavailable ? '#bdbdbd' : this.severityColor;
    const textColor = this.unavailable
      ? 'var(--disabled-text-color, #9e9e9e)'
      : 'var(--primary-text-color)';
    const subColor = this.unavailable
      ? 'var(--disabled-text-color, #9e9e9e)'
      : 'var(--secondary-text-color)';

    const filledLen = this.ratio * this.arcLength;
    const totalLen = this.arcLength;

    return html`
      <div class="gauge-container">
        ${this.icon && !this.unavailable
          ? html`<ha-icon .icon=${this.icon} class="gauge-icon"></ha-icon>`
          : nothing}

        <div class="gauge-value-area">
          <span class="value-number" style="color: ${textColor}">${displayValue}</span>
          ${this.showUnit && this.unit && !this.unavailable
            ? html`<span class="value-unit" style="color: ${subColor}">${this.unit}</span>`
            : nothing}
        </div>

        <svg
          viewBox="0 0 120 72"
          class="gauge-svg"
          role="img"
          aria-label="${this.name}: ${displayValue}${this.unit ? ' ' + this.unit : ''}"
        >
          <!-- Background arc -->
          <path
            d="${this.arcPath}"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="${this.strokeWidth}"
            fill="none"
            stroke-linecap="round"
          />

          <!-- Foreground arc (stroke-dasharray shows only the filled portion) -->
          ${this.ratio > 0 && !this.unavailable
            ? html`
                <path
                  d="${this.arcPath}"
                  stroke="${arcColor}"
                  stroke-width="${this.strokeWidth}"
                  fill="none"
                  stroke-linecap="round"
                  stroke-dasharray="${filledLen.toFixed(2)} ${totalLen.toFixed(2)}"
                  class="arc-fill"
                />
              `
            : nothing}
        </svg>

        ${this.name
          ? html`<div class="gauge-name" style="color: ${subColor}">${this.name}</div>`
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .gauge-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      position: relative;
    }

    .gauge-icon {
      position: absolute;
      top: 2px;
      right: 4px;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
      z-index: 1;
    }

    .gauge-value-area {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -65%);
      display: flex;
      align-items: baseline;
      gap: 3px;
      z-index: 1;
      pointer-events: none;
    }

    .value-number {
      font-size: 20px;
      font-weight: 600;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      line-height: 1;
    }

    .value-unit {
      font-size: 11px;
      font-weight: 400;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      line-height: 1;
    }

    .gauge-svg {
      width: 100%;
      height: auto;
      display: block;
    }

    .arc-fill {
      transition: stroke 0.3s ease;
    }

    .gauge-name {
      font-size: 11px;
      font-weight: 500;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
      line-height: 1.3;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }

    :host([compact]) .gauge-icon {
      --mdc-icon-size: 14px;
      top: 0;
      right: 2px;
    }

    :host([compact]) .value-number {
      font-size: 16px;
    }

    :host([compact]) .value-unit {
      font-size: 9px;
    }

    :host([compact]) .gauge-name {
      font-size: 9px;
    }
  `;
}