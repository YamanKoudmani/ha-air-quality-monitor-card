import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HistoryPoint } from './types';
import { generateSparklinePath, generateSparklineAreaPath } from './utils';

let instanceCounter = 0;

/**
 * Sparkline trend graph component (aqm-sparkline)
 *
 * Displays a simple SVG sparkline with a filled area gradient beneath the line.
 * No axes or labels — just the trend shape.
 */
@customElement('aqm-sparkline')
export class AqmSparkline extends LitElement {
  /** Array of {timestamp, value} history data points */
  @property({ type: Array })
  data: HistoryPoint[] = [];

  /** Line and gradient color */
  @property({ type: String })
  color = '#4caf50';

  /** SVG viewBox width */
  @property({ type: Number })
  width = 120;

  /** SVG viewBox height */
  @property({ type: Number })
  height = 40;

  /** Unique gradient ID for this instance (avoids SVG ID conflicts) */
  private gradientId = `sparkline-grad-${++instanceCounter}`;

  private get linePath(): string {
    return generateSparklinePath(this.data, this.width, this.height);
  }

  private get areaPath(): string {
    return generateSparklineAreaPath(this.data, this.width, this.height);
  }

  render() {
    if (!this.data || this.data.length < 2) {
      return html`<svg class="sparkline-svg" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="none" part="svg"></svg>`;
    }

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
          <linearGradient id="${this.gradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${this.color}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${this.color}" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- Area fill under the line -->
        <path
          d="${this.areaPath}"
          fill="url(#${this.gradientId})"
          class="sparkline-area"
        />

        <!-- The line itself -->
        <path
          d="${this.linePath}"
          fill="none"
          stroke="${this.color}"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="sparkline-line"
        />
      </svg>
    `;
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
