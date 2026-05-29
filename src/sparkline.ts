import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HistoryPoint } from './types';
import { generateSparklinePath, generateSparklineAreaPath } from './utils';
import { getSeverity } from './const';

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

  private areaGradientId = `spark-area-${++instanceCounter}`;
  private lineGradientId = `spark-line-${instanceCounter}`;

  private get linePath(): string {
    return generateSparklinePath(this.data, this.width, this.height);
  }

  private get areaPath(): string {
    return generateSparklineAreaPath(this.data, this.width, this.height);
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
          <!-- Area fill gradient (vertical, single color fading down) -->
          <linearGradient id="${this.areaGradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${this.color}" stop-opacity="0.4" />
            <stop offset="100%" stop-color="${this.color}" stop-opacity="0.05" />
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
    if (this.useGradient) {
      const gradEl = this.shadowRoot?.getElementById(this.lineGradientId);
      if (gradEl) {
        gradEl.innerHTML = this.lineGradientStopsHTML;
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