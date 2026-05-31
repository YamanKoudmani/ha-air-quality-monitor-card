import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { fireEvent } from 'custom-card-helpers';
import type { AirQualityCardConfig, MetricData, HistoryPoint } from './types';
import {
  CARD_VERSION,
  DEFAULT_COLUMNS,
  DEFAULT_SHOW_SPARKLINES,
  DEFAULT_SPARKLINE_HOURS,
  DEFAULT_COMPACT,
  DEFAULT_SMOOTH_SPARKLINES,
  DEFAULT_STEP_SPARKLINES,
} from './const';
import { resolveMetricData, fetchHistory, detectTrend } from './utils';
import './editor';

@customElement('air-quality-monitor-card')
export class AirQualityMonitorCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: AirQualityCardConfig;

  private _historyCache = new Map<string, HistoryPoint[]>();

  static getConfigElement(): HTMLElement {
    return document.createElement('air-quality-monitor-card-editor');
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      type: 'custom:air-quality-monitor-card',
      title: 'Air Quality Monitor',
      entities: [
        { entity: 'sensor.pm25' },
        { entity: 'sensor.co2' },
      ],
      columns: DEFAULT_COLUMNS,
      show_sparklines: DEFAULT_SHOW_SPARKLINES,
      sparkline_hours: DEFAULT_SPARKLINE_HOURS,
      compact: DEFAULT_COMPACT,
      smooth_sparklines: DEFAULT_SMOOTH_SPARKLINES,
      step_sparklines: DEFAULT_STEP_SPARKLINES,
    };
  }

  getCardSize(): number {
    const entities = this._config?.entities?.length ?? 0;
    if (entities === 0) return 2;
    const columns = this._config?.columns ?? DEFAULT_COLUMNS;
    const rows = Math.ceil(entities / columns);
    const title = this._config?.title ? 1 : 0;
    const rowHeight = this._config?.compact ? 2 : 3;
    return Math.ceil(title + rows * rowHeight);
  }

  public setConfig(config: AirQualityCardConfig): void {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('At least one entity must be configured');
    }

    // Invalidate cache if sparkline_hours changed or entity list changed
    const prevEntities = new Set(this._config?.entities?.map((e) => e.entity) ?? []);
    const newEntities = new Set(config.entities.map((e) => e.entity));
    const entitiesChanged =
      prevEntities.size !== newEntities.size ||
      [...prevEntities].some((e) => !newEntities.has(e));
    if (
      this._config?.sparkline_hours !== config.sparkline_hours ||
      entitiesChanged
    ) {
      this._historyCache.clear();
    }

    this._config = {
      ...config,
      columns: config.columns ?? DEFAULT_COLUMNS,
      show_sparklines: config.show_sparklines ?? DEFAULT_SHOW_SPARKLINES,
      sparkline_hours: config.sparkline_hours ?? DEFAULT_SPARKLINE_HOURS,
      compact: config.compact ?? DEFAULT_COMPACT,
      smooth_sparklines: config.smooth_sparklines ?? DEFAULT_SMOOTH_SPARKLINES,
      step_sparklines: config.step_sparklines ?? DEFAULT_STEP_SPARKLINES,
    };
  }

  protected willUpdate(changedProps: PropertyValues<this>): void {
    if (changedProps.has('hass') && this.hass && this._config) {
      this._fetchHistoryIfNeeded();
    }
  }

  private async _fetchHistoryIfNeeded(): Promise<void> {
    if (!this.hass || !this._config) return;
    if (!this._config.show_sparklines) return;

    const entities = this._config.entities || [];
    const hours = this._config.sparkline_hours ?? DEFAULT_SPARKLINE_HOURS;

    const needsFetch = entities.filter((e) => !this._historyCache.has(e.entity));
    if (needsFetch.length === 0) return;

    const promises = needsFetch.map(async (entity) => {
      try {
        const history = await fetchHistory(this.hass!, entity.entity, hours);
        this._historyCache.set(entity.entity, history);
      } catch {
        this._historyCache.set(entity.entity, []);
      }
    });

    await Promise.all(promises);
    this.requestUpdate();
  }

  private _getMetricData(): MetricData[] {
    if (!this.hass || !this._config) return [];
    const entities = this._config.entities || [];
    return entities.map((entity) =>
      resolveMetricData(entity, this.hass!, this._historyCache.get(entity.entity) || []),
    );
  }

  /** Check whether a specific metric should show its sparkline */
  private _shouldShowSparkline(data: MetricData, config: AirQualityCardConfig): boolean {
    const entitySetting = data.config.show_sparkline;
    if (entitySetting !== undefined) return entitySetting;
    return config.show_sparklines !== false;
  }

  /** Open the more-info dialog for an entity */
  private _handleMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  protected render(): unknown {
    if (!this._config) return nothing;

    const config = this._config;
    const entities = config.entities || [];

    if (entities.length === 0) {
      return html`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:air-filter"></ha-icon>
            <p>No entities configured</p>
          </div>
        </ha-card>
      `;
    }

    const metrics = this._getMetricData();
    const columns = Math.min(Math.max(config.columns ?? DEFAULT_COLUMNS, 1), 6);

    return html`
      <ha-card>
        ${config.title
          ? html`<div class="card-header">${config.title}</div>`
          : nothing}

        <div
          class="grid ${classMap({ compact: !!config.compact })}"
          style="grid-template-columns: repeat(${columns}, 1fr)"
        >
          ${metrics.map(
            (data) => {
              const trend = detectTrend(data.history);
              return html`
                <div
                  class="entity-cell ${classMap({
                    unavailable: data.unavailable,
                  })}"
                  @click=${() => this._handleMoreInfo(data.config.entity)}
                >
                  <aqm-gauge
                    .value=${data.stateNumeric}
                    .min=${data.config.min ?? 0}
                    .max=${data.config.max ?? 100}
                    .severityColor=${data.severity.color}
                    .severityLabel=${data.severity.label}
                    .name=${data.name}
                    .unit=${data.unit}
                    .showUnit=${data.config.show_unit !== false}
                    .icon=${data.icon}
                    .unavailable=${data.unavailable}
                    .compact=${!!config.compact}
                    .trend=${trend}
                  ></aqm-gauge>

${this._shouldShowSparkline(data, config)
                    ? html`
                        <aqm-sparkline
                           .data=${data.history}
                           .color=${data.severity.color}
                           .severity=${data.config.severity as Record<string, number> | undefined}
                           .min=${data.config.min ?? 0}
                           .max=${data.config.max ?? 100}
                           .smooth=${config.smooth_sparklines === true}
                           .step=${config.step_sparklines !== false}
                           .timeStart=${Date.now() - (config.sparkline_hours ?? DEFAULT_SPARKLINE_HOURS) * 3600000}
                           .timeEnd=${Date.now()}
                         ></aqm-sparkline>
                      `
                    : nothing}
                </div>
              `;
            },
          )}
        </div>
      </ha-card>
    `;
  }

  static get styles(): ReturnType<typeof css> {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 20px;
        box-sizing: border-box;
      }

      .card-header {
        font-family: var(--paper-font-headline_-_font-family, inherit);
        font-size: 22px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin: 0 0 16px 0;
        padding: 0;
        line-height: 1.2;
      }

      .grid {
        display: grid;
        gap: 12px;
      }

      .entity-cell {
        background: var(
          --ha-card-background,
          var(--card-background-color, var(--secondary-background-color, #f5f5f5))
        );
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: background 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        min-width: 0;
        cursor: pointer;
      }

      .entity-cell:hover {
        box-shadow: var(
          --ha-card-box-shadow,
          0 2px 8px rgba(0, 0, 0, 0.08)
        );
      }

      .compact .entity-cell {
        padding: 10px;
        border-radius: 8px;
        gap: 4px;
      }

      .entity-cell.unavailable {
        opacity: 0.55;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 16px;
        color: var(--secondary-text-color);
        gap: 12px;
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--disabled-text-color);
      }

      .empty-state p {
        margin: 0;
        font-size: 14px;
        text-align: center;
      }

      
    `;
  }
}

/* ---------- side-effect sub-component imports ---------- */
import './gauge';
import './sparkline';

/* ---------- HA custom cards registry ---------- */
declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'air-quality-monitor-card',
  name: 'Air Quality Monitor Card',
  description: 'Monitor air quality with gauges and trend graphs',
  preview: true,
});

/* ---------- version banner ---------- */
console.info(
  `%c AIR-QUALITY-MONITOR-CARD %c v${CARD_VERSION} `,
  'color: white; background: #4caf50; font-weight: bold;',
  'color: #4caf50; background: white; font-weight: bold;',
);