import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { describeArc, formatValue } from './utils';

/** @ts-ignore — ha-icon is provided by HA at runtime */
declare global {
  interface HTMLElementTagNameMap {
    'ha-icon': HTMLElement & { icon: string };
  }
}

/**
 * Circular arc gauge component (aqm-gauge)
 *
 * Displays a single metric value as a semi-circular speedometer-style arc.
 * Supports severity coloring, unavailable state, and compact mode.
 */
@customElement('aqm-gauge')
export class AqmGauge extends LitElement {
  /** Current value of the metric, or null if unknown */
  @property({ type: Number })
  value: number | null = null;

  /** Minimum value of the gauge range */
  @property({ type: Number })
  min = 0;

  /** Maximum value of the gauge range */
  @property({ type: Number })
  max = 100;

  /** Color for the current severity level */
  @property({ type: String })
  severityColor = '#9e9e9e';

  /** Metric name label displayed at the bottom */
  @property({ type: String })
  name = '';

  /** Unit label displayed below the value */
  @property({ type: String })
  unit = '';

  /** MDI icon name (e.g. 'mdi:air-filter') shown above the value */
  @property({ type: String })
  icon = '';

  /** Whether the entity is unavailable (grays everything out) */
  @property({ type: Boolean, reflect: true })
  unavailable = false;

  /** Compact mode reduces font sizes and hides the icon */
  @property({ type: Boolean, reflect: true })
  compact = false;

  // Gauge geometry
  // Arc sweeps 240 degrees clockwise from 150 to 390 degrees.
  // SVG viewBox is 120 x 80; arc center at (68, 46), radius 28.
  private readonly cx = 68;
  private readonly cy = 46;
  private readonly radius = 28;
  private readonly startAngle = 150;
  private readonly endAngle = 390;
  private readonly strokeWidth = 8;

  /** 0..1 fraction of the arc that should be filled */
  private get ratio(): number {
    if (this.value === null || this.value === undefined) return 0;
    const r = (this.value - this.min) / (this.max - this.min);
    return Math.max(0, Math.min(1, r));
  }

  /** End-angle for the filled portion of the arc (degrees) */
  private get filledAngle(): number {
    return this.startAngle + this.ratio * (this.endAngle - this.startAngle);
  }

  /** SVG path for the full background arc (always gray) */
  private get backgroundArcPath(): string {
    return describeArc(this.cx, this.cy, this.radius, this.startAngle, this.endAngle);
  }

  /** SVG path for the filled portion of the arc */
  private get filledArcPath(): string {
    if (this.value === null || this.value === undefined) return '';
    return describeArc(this.cx, this.cy, this.radius, this.startAngle, this.filledAngle);
  }

  render() {
    const displayValue = this.unavailable ? '\u2014' : formatValue(this.value);
    const displayUnit = this.unavailable ? '' : this.unit;
    const arcColor = this.unavailable ? '#e0e0e0' : this.severityColor;
    const labelColor = this.unavailable ? '#9e9e9e' : 'var(--secondary-text-color, #888888)';
    const showIcon = !!(this.icon && !this.compact && !this.unavailable);

    return html`
      <svg
        viewBox="0 0 120 80"
        part="svg"
        class="gauge-svg"
        role="img"
        aria-label="${this.name}: ${displayValue}${displayUnit ? ' ' + displayUnit : ''}"
      >
        <!-- Background arc (full sweep, light gray) -->
        <path
          d="${this.backgroundArcPath}"
          stroke="#e0e0e0"
          stroke-width="${this.strokeWidth}"
          fill="none"
          stroke-linecap="round"
          class="arc-bg"
        />

        <!-- Foreground arc (partial sweep, severity colored) -->
        ${this.value !== null && !this.unavailable
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

        <!-- Icon -->
        ${showIcon
          ? html`
              <foreignObject x="48" y="6" width="24" height="24">
                <ha-icon .icon="${this.icon}"></ha-icon>
              </foreignObject>
            `
          : nothing}

        <!-- Value text -->
        <text
          x="60"
          y="${this.compact ? 48 : 52}"
          text-anchor="middle"
          fill="${this.unavailable ? '#9e9e9e' : 'var(--primary-text-color, #212121)'}"
          class="value-text"
        >
          ${displayValue}
        </text>

        <!-- Unit label -->
        ${displayUnit
          ? html`
              <text
                x="60"
                y="${this.compact ? 57 : 61}"
                text-anchor="middle"
                fill="${labelColor}"
                class="unit-text"
              >
                ${displayUnit}
              </text>
            `
          : nothing}

        <!-- Unavailable indicator -->
        ${this.unavailable
          ? html`
              <text
                x="60"
                y="52"
                text-anchor="middle"
                fill="#9e9e9e"
                class="unavailable-text"
              >
                Unavailable
              </text>
            `
          : nothing}

        <!-- Metric name at the bottom -->
        ${this.name
          ? html`
              <text
                x="60"
                y="76"
                text-anchor="middle"
                fill="${labelColor}"
                class="name-text"
              >
                ${this.name}
              </text>
            `
          : nothing}
      </svg>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .gauge-svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
    }

    /* Arc transitions */
    .arc-bg {
      transition: stroke 0.3s ease;
    }

    .arc-fill {
      transition: stroke 0.3s ease, stroke-width 0.3s ease;
    }

    /* Text styles */
    .value-text {
      font-size: 18px;
      font-weight: 700;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
      transition: fill 0.3s ease;
    }

    .unit-text {
      font-size: 10px;
      font-weight: 400;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
      transition: fill 0.3s ease;
    }

    .name-text {
      font-size: 9px;
      font-weight: 500;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: fill 0.3s ease;
    }

    .unavailable-text {
      font-size: 10px;
      font-weight: 500;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    /* Compact mode overrides */
    :host([compact]) .value-text {
      font-size: 14px;
    }

    :host([compact]) .unit-text {
      font-size: 9px;
    }

    :host([compact]) .name-text {
      font-size: 8px;
    }
  `;
}
