import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { describeArc, formatValue } from './utils';

/**
 * Circular arc gauge component (aqm-gauge)
 *
 * Speedometer-style arc: 240° sweep with 120° gap at the bottom.
 * Arc goes clockwise from lower-right (330°) through top to lower-left (210°).
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
  // Angles use convention: 0°=top, 90°=right, 180°=bottom, 270°=left
  // Arc sweeps clockwise from 330° (lower-right) to 210° (lower-left)
  // That's 240° of arc with a 120° gap at the bottom
  private readonly cx = 60;
  private readonly cy = 40;
  private readonly radius = 28;
  private readonly arcStart = 330;   // lower-right (~4 o'clock)
  private readonly arcEnd = 210;     // lower-left (~8 o'clock)
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
    const displayValue = this.unavailable ? '—' : formatValue(this.value);
    const arcColor = this.unavailable ? '#bdbdbd' : this.severityColor;
    const textColor = this.unavailable
      ? 'var(--disabled-text-color, #9e9e9e)'
      : 'var(--primary-text-color)';
    const subColor = this.unavailable
      ? 'var(--disabled-text-color, #9e9e9e)'
      : 'var(--secondary-text-color)';

    // Show unit inline with value or below
    const valueText = this.showUnit && this.unit
      ? html`${displayValue}<tspan class="unit-inline"> ${this.unit}</tspan>`
      : html`${displayValue}`;

    return html`
      <div class="gauge-container">
        <svg
          viewBox="0 0 120 72"
          class="gauge-svg"
          role="img"
          aria-label="${this.name}: ${displayValue}${this.unit ? ' ' + this.unit : ''}"
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
            y="${this.compact ? 40 : 42}"
            text-anchor="middle"
            fill="${textColor}"
            class="value-text"
          >${valueText}</text>

          <!-- Unavailable label -->
          ${this.unavailable
            ? html`
                <text
                  x="60"
                  y="42"
                  text-anchor="middle"
                  fill="var(--disabled-text-color, #9e9e9e)"
                  class="unavailable-text"
                >N/A</text>
              `
            : nothing}
        </svg>

        <div class="gauge-footer">
          ${this.icon && !this.compact && !this.unavailable
            ? html`<ha-icon .icon=${this.icon} class="gauge-icon"></ha-icon>`
            : nothing}
          ${this.name
            ? html`<span class="gauge-name" style="color: ${subColor}">${this.name}</span>`
            : nothing}
        </div>
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

    .unit-inline {
      font-size: 11px;
      font-weight: 400;
    }

    .unavailable-text {
      font-size: 11px;
      font-weight: 500;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    .gauge-footer {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }

    .gauge-icon {
      --mdc-icon-size: 16px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }

    .gauge-name {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host([compact]) .value-text {
      font-size: 14px;
    }

    :host([compact]) .unit-inline {
      font-size: 9px;
    }

    :host([compact]) .gauge-icon {
      --mdc-icon-size: 14px;
    }

    :host([compact]) .gauge-name {
      font-size: 9px;
    }
  `;
}