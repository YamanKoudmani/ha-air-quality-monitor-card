import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HistoryPoint } from './types';
import { generateSparklinePath, generateSparklineAreaPath } from './utils';
import { getSeverity } from './const';

let instanceCounter = 0;

/**
 * Sparkline trend graph component (aqm-sparkline)
 *
 * Displays an SVG sparkline with per-segment coloring based on severity.
 * Each line segment is colored according to the severity of its data point,
 * giving a visual indication of how air quality changed over time.
 */
@customElement('aqm-sparkline')
export class AqmSparkline extends LitElement {
  /** Array of {timestamp, value} history data points */
  @property({ type: Array })
  data: HistoryPoint[] = [];

  /** Line color (used as fallback and for the area gradient) */
  @property({ type: String })
  color = '#4caf50';

  /** Severity thresholds for per-point coloring */
  @property({ type: Object })
  severity: Record<string, number> | undefined = undefined;

  /** Min value for severity calculation */
  @property({ type: Number })
  min: number = 0;

  /** Max value for severity calculation */
  @property({ type: Number })
  max: number = 100;

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

  /** Get the severity color for a given value */
  private getColorForValue(value: number): string {
    if (this.severity) {
      return getSeverity(value, this.severity).color;
    }
    return this.color;
  }

  /**
   * Generate colored line segments.
   * Each segment goes from point[i] to point[i+1] and is colored
   * based on the severity of point[i]'s value.
   */
  private get coloredSegments(): Array<{ path: string; color: string }> {
    if (!this.data || this.data.length < 2) return [];

    const values = this.data.map(p => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const effectiveWidth = this.width - 4; // 2px padding each side
    const effectiveHeight = this.height - 4;
    const stepX = effectiveWidth / (this.data.length - 1);

    const segments: Array<{ path: string; color: string }> = [];

    for (let i = 0; i < this.data.length - 1; i++) {
      const x1 = 2 + i * stepX;
      const x2 = 2 + (i + 1) * stepX;
      const y1 = 2 + effectiveHeight - ((this.data[i].value - minVal) / range) * effectiveHeight;
      const y2 = 2 + effectiveHeight - ((this.data[i + 1].value - minVal) / range) * effectiveHeight;

      const path = `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      const color = this.getColorForValue(this.data[i].value);
      segments.push({ path, color });
    }

    return segments;
  }

  render() {
    if (!this.data || this.data.length < 2) {
      return html`<svg class="sparkline-svg" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="none" part="svg"></svg>`;
    }

    const hasSeverity = !!this.severity;

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

        <!-- Colored line segments (per-point severity) or single-color line -->
        ${hasSeverity
          ? this.coloredSegments.map(
              (seg) => html`
                <path
                  d="${seg.path}"
                  fill="none"
                  stroke="${seg.color}"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="sparkline-segment"
                />
              `,
            )
          : html`
              <path
                d="${this.linePath}"
                fill="none"
                stroke="${this.color}"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="sparkline-line"
              />
            `}
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

    .sparkline-line,
    .sparkline-segment {
      transition: stroke 0.3s ease;
    }
  `;
}