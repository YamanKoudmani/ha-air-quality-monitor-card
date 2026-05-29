import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { describeArc, formatValue } from './utils';

/**
 * Circular arc gauge component (aqm-gauge)
 *
 * Displays a single metric value as a speedometer-style arc.
 * The arc opens at the bottom (120° gap) and sweeps 240° clockwise.
 * Supports severity coloring, unavailable state, and compact mode.
 */
@customElement('aqm-gauge')
export class AqmGauge extends LitElement {
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: String }) severityColor = '#9e9e9e';
  @property({ type: String }) name = '';
  @property({ type: String }) unit = '';
  @property({ type: String }) icon = '';
  @property({ type: Boolean, reflect: true }) unavailable = false;
  @property({ type: Boolean, reflect: true }) compact = false;

  // Gauge geometry — 240° clockwise arc with 120° gap at the bottom
  // Arc starts at 240° (lower-left, ~8 o'clock) and ends at 120° (lower-right, ~4 o'clock)
  private readonly cx = 60;
  private readonly cy = 42;
  private readonly radius = 30;
  private readonly arcStart = 240;  // lower-left
  private readonly arcEnd = 120;     // lower-right
  private readonly totalSweep = 240; // degrees
  private readonly strokeWidth = 7;

  /** 0..1 fraction of the arc that should be filled */
  private get ratio(): number {
    if (this.value === null || this.value === undefined) return 0;
    if (this.max === this.min) return 0;
    const r = (this.value - this.min) / (this.max - this.min);
    return Math.max(0, Math.min(1, r));
  }

  /** Angle where the filled portion ends (clockwise from arcStart) */
  private get filledAngle(): number {
    return (this.arcStart + this.ratio * this.totalSweep) % 360;
  }

  /** SVG path for the full background arc */
  private get backgroundArcPath(): string {
    return describeArc(this.cx, this.cy, this.radius, this.arcStart, this.arcEnd);
  }

  /** SVG path for the filled portion of the arc */
  private get filledArcPath(): string {
    if (this.value === null || this.value === undefined || this.ratio <= 0) return '';
    return describeArc(this.cx, this.cy, this.radius, this.arcStart, this.filledAngle);
  }

  render() {
    const displayValue = this.unavailable ? '\u2014' : formatValue(this.value);
    const displayUnit = this.unavailable ? '' : this.unit;
    const arcColor = this.unavailable ? '#bdbdbd' : this.severityColor;
    const textColor = this.unavailable
      ? 'var(--disabled-text-color, #9e9e9e)'
      : 'var(--primary-text-color)';
    const subColor = this.unavailable
      ? 'var(--disabled-text-color, #9e9e9e)'
      : 'var(--secondary-text-color)';

    return html`
      <div class="gauge-container">
        ${this.icon && !this.compact && !this.unavailable
          ? html`<ha-icon .icon=${this.icon} class="gauge-icon"></ha-icon>`
          : nothing}

        <svg
          viewBox="0 0 120 75"
          class="gauge-svg"
          role="img"
          aria-label="${this.name}: ${displayValue}${displayUnit ? ' ' + displayUnit : ''}"
        >
          <!-- Background arc -->
          <path
            d="${this.backgroundArcPath}"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="${this.strokeWidth}"
            fill="none"
            stroke-linecap="round"
          />

          <!-- Foreground arc (severity colored) -->
          ${this.ratio > 0 && !this.unavailable
            ? html`
                <path
                  d="${this.filledArcPath}"
                  stroke="${arcColor}"
                  stroke-width="${this.strokeWidth}"
                  fill="none"
                  stroke-linecap="round"
                  class="arc-fill"
                />
              `
            : nothing}

          <!-- Value text -->
          <text
            x="60"
            y="${this.compact ? 44 : 46}"
            text-anchor="middle"
            fill="${textColor}"
            class="value-text"
          >
            ${displayValue}
          </text>

          <!-- Unit text -->
          ${displayUnit
            ? html`
                <text
                  x="60"
                  y="${this.compact ? 54 : 56}"
                  text-anchor="middle"
                  fill="${subColor}"
                  class="unit-text"
                >
                  ${displayUnit}
                </text>
              `
            : nothing}

          <!-- Unavailable label -->
          ${this.unavailable
            ? html`
                <text
                  x="60"
                  y="46"
                  text-anchor="middle"
                  fill="var(--disabled-text-color, #9e9e9e)"
                  class="unavailable-text"
                >
                  N/A
                </text>
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
    }

    .gauge-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }

    .gauge-svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
    }

    .arc-fill {
      transition: stroke 0.3s ease;
    }

    .value-text {
      font-size: 18px;
      font-weight: 600;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    .unit-text {
      font-size: 10px;
      font-weight: 400;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    .unavailable-text {
      font-size: 11px;
      font-weight: 500;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    .gauge-name {
      font-size: 11px;
      font-weight: 500;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
      line-height: 1.2;
    }

    :host([compact]) .gauge-icon {
      display: none;
    }

    :host([compact]) .value-text {
      font-size: 14px;
    }

    :host([compact]) .unit-text {
      font-size: 9px;
    }

    :host([compact]) .gauge-name {
      font-size: 9px;
    }
  `;
}