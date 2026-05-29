import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HistoryPoint } from './types';
import { generateSparklinePath, generateSparklineAreaPath, generateSmoothSparklinePath, generateSmoothSparklineAreaPath, generateStepSparklinePath, generateStepSparklineAreaPath } from './utils';
import { getSeverity, SEVERITY_COLORS, SEVERITY_ORDER } from './const';

let instanceCounter = 0;

/**
 * Sparkline trend graph component (aqm-sparkline)
 *
 * Displays an SVG sparkline with per-point coloring via a horizontal
 * linearGradient on the line stroke. Falls back to a solid color line
 * if no severity config is provided.
 *
 * IMPORTANT: All SVG elements are always in the outer template (no
 * conditional html`` inside <svg>) to ensure Lit creates them with
 * the correct SVG namespace. Visibility is controlled via attributes
 * (stroke="none" to hide) rather than conditional rendering.
 *
 * Gradient stops are injected via innerHTML in updated() to avoid
 * nested template issues inside <defs>.
 */
@customElement('aqm-sparkline')
export class AqmSparkline extends LitElement {
  @property({ type: Array }) data: HistoryPoint[] = [];
  @property({ type: String }) color = '#4caf50';
  @property({ type: Object }) severity: Record<string, number> | undefined = undefined;
  @property({ type: Number }) min: number = 0;
  @property({ type: Number }) max: number = 100;
  @property({ type: Number }) width = 120;
  @property({ type: Number }) height = 40;
  @property({ type: Boolean }) smooth = false;
  @property({ type: Boolean }) step = true;

  private areaGradientId = `spark-area-${++instanceCounter}`;
  private lineGradientId = `spark-line-${instanceCounter}`;

  private get linePath(): string {
    if (this.step) {
      return generateStepSparklinePath(this.data, this.width, this.height);
    }
    return this.smooth
      ? generateSmoothSparklinePath(this.data, this.width, this.height)
      : generateSparklinePath(this.data, this.width, this.height);
  }

  private get areaPath(): string {
    if (this.step) {
      return generateStepSparklineAreaPath(this.data, this.width, this.height);
    }
    return this.smooth
      ? generateSmoothSparklineAreaPath(this.data, this.width, this.height)
      : generateSparklineAreaPath(this.data, this.width, this.height);
  }

  private get hasData(): boolean {
    return !!(this.data && this.data.length >= 2);
  }

  private get useGradient(): boolean {
    return !!this.severity && this.hasData;
  }

  /** Build the SVG stops markup for the line gradient */
  private get lineGradientStopsHTML(): string {
    if (!this.hasData || !this.severity) return '';
    const points = this.data;
    const step = Math.max(1, Math.floor(points.length / 30));
    const stops: string[] = [];
    for (let i = 0; i < points.length; i += step) {
      const pct = points.length > 1 ? (i / (points.length - 1)) * 100 : 0;
      const color = getSeverity(points[i].value, this.severity).color;
      stops.push(`<stop offset="${pct.toFixed(1)}%" stop-color="${color}"/>`);
    }
    // Always include last point
    const lastIdx = points.length - 1;
    const lastColor = getSeverity(points[lastIdx].value, this.severity).color;
    stops.push(`<stop offset="100%" stop-color="${lastColor}"/>`);
    return stops.join('');
  }

  /** Build the SVG stops markup for the area gradient (severity-based vertical) */
  private get areaGradientStopsHTML(): string {
    if (this.severity) {
      // Severity-based gradient: green at bottom (low values) → red at top (high values)
      const stops: string[] = [];
      const range = this.max - this.min || 1;

      // Top of chart (offset 0%) = worst severity color
      const worstLevel = SEVERITY_ORDER.find(l => this.severity![l] !== undefined);
      if (worstLevel) {
        stops.push(`<stop offset="0%" stop-color="${SEVERITY_COLORS[worstLevel]}" stop-opacity="0.35"/>`);
      }

      // Threshold stops (SEVERITY_ORDER is worst-to-best = decreasing threshold = increasing offset)
      for (const level of SEVERITY_ORDER) {
        const threshold = this.severity[level];
        if (threshold === undefined) continue;
        const offset = ((this.max - threshold) / range) * 100;
        stops.push(`<stop offset="${Math.max(0, Math.min(100, offset)).toFixed(1)}%" stop-color="${SEVERITY_COLORS[level]}" stop-opacity="0.35"/>`);
      }

      // Bottom of chart (offset 100%) = good color
      stops.push(`<stop offset="100%" stop-color="${SEVERITY_COLORS.good}" stop-opacity="0.15"/>`);

      return stops.join('');
    }

    // Fallback: single-color fade
    return `<stop offset="0%" stop-color="${this.color}" stop-opacity="0.4"/><stop offset="100%" stop-color="${this.color}" stop-opacity="0.05"/>`;
  }

  render() {
    const lineStroke = this.useGradient ? `url(#${this.lineGradientId})` : this.color;

    return html`
      <svg
        viewBox="0 0 ${this.width} ${this.height}"
        preserveAspectRatio="none"
        class="sparkline-svg"
        part="svg"
        role="img"
        aria-label="Sparkline chart"
      >
        <defs>
          <!-- Area fill gradient (vertical, severity-based or single-color) -->
          <!-- Stops are injected via innerHTML in updated() -->
          <linearGradient id="${this.areaGradientId}" x1="0" y1="0" x2="0" y2="1">
          </linearGradient>

          <!-- Line stroke gradient (horizontal, per-point severity colors) -->
          <!-- Stops are injected via innerHTML in updated() to avoid SVG namespace issues -->
          <linearGradient id="${this.lineGradientId}" x1="0" y1="0" x2="1" y2="0">
          </linearGradient>
        </defs>

        <!-- Area fill under the line (always present, empty path if no data) -->
        <path
          d="${this.hasData ? this.areaPath : ''}"
          fill="${this.hasData ? `url(#${this.areaGradientId})` : 'none'}"
          class="sparkline-area"
        />

        <!-- Solid color line (always present, serves as fallback and base) -->
        <path
          d="${this.hasData ? this.linePath : ''}"
          fill="none"
          stroke="${this.hasData ? this.color : 'none'}"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="sparkline-line"
        />

        <!-- Gradient line on top (per-point severity coloring) -->
        <!-- Rendered with stroke="none" when no gradient, stroke=url when gradient available -->
        <path
          d="${this.hasData ? this.linePath : ''}"
          fill="none"
          stroke="${this.useGradient ? lineStroke : 'none'}"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  updated(): void {
    // Inject gradient stops via DOM after render to avoid Lit SVG namespace issues
    // with nested html`` templates inside <defs>

    // Area gradient (always present — severity-based or single-color fallback)
    const areaGradEl = this.shadowRoot?.getElementById(this.areaGradientId);
    if (areaGradEl) {
      areaGradEl.innerHTML = this.areaGradientStopsHTML;
    }

    // Line gradient (only when severity data is available)
    if (this.useGradient) {
      const lineGradEl = this.shadowRoot?.getElementById(this.lineGradientId);
      if (lineGradEl) {
        lineGradEl.innerHTML = this.lineGradientStopsHTML;
      }
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .sparkline-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .sparkline-area {
      transition: fill 0.3s ease;
    }

    .sparkline-line {
      transition: stroke 0.3s ease;
    }
  `;
}