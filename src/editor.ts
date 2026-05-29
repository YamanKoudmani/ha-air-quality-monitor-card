import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { fireEvent } from 'custom-card-helpers';
import type { AirQualityCardConfig, MetricEntityConfig } from './types';
import {
  DEFAULT_COLUMNS,
  DEFAULT_SHOW_SPARKLINES,
  DEFAULT_SPARKLINE_HOURS,
  DEFAULT_COMPACT,
} from './const';

@customElement('air-quality-monitor-card-editor')
export class AirQualityMonitorCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: AirQualityCardConfig;

  public setConfig(config: AirQualityCardConfig): void {
    this._config = config;
  }

  /* ---------- helpers ---------- */

  /** Return all sensor entities sorted by friendly name */
  private _getSensorEntities(): Array<{ id: string; name: string }> {
    if (!this.hass) return [];
    return Object.keys(this.hass.states)
      .filter((id) => id.startsWith('sensor.'))
      .map((id) => ({
        id,
        name:
          this.hass!.states[id].attributes.friendly_name || id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Deep-clone the entities array so we never mutate the original config */
  private _cloneEntities(
    entities?: MetricEntityConfig[],
  ): MetricEntityConfig[] {
    return (entities ?? []).map((e) => ({ ...e }));
  }

  /* ---------- event handlers ---------- */

  private _handleTitleChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this._updateConfig({ ...this._config!, title: value || undefined });
  }

  private _handleColumnsChange(e: Event): void {
    const raw = (e.target as HTMLInputElement).value;
    const value = parseInt(raw, 10);
    if (isNaN(value) || value < 1 || value > 6) return;
    this._updateConfig({ ...this._config!, columns: value });
  }

  private _handleCompactChange(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this._updateConfig({ ...this._config!, compact: checked });
  }

  private _handleSparklineToggle(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this._updateConfig({ ...this._config!, show_sparklines: checked });
  }

  private _handleSparklineHoursChange(e: Event): void {
    const raw = (e.target as HTMLInputElement).value;
    const value = parseInt(raw, 10);
    if (isNaN(value) || value < 1 || value > 168) return;
    this._updateConfig({ ...this._config!, sparkline_hours: value });
  }

  private _handleEntityChange(
    index: number,
    field: 'entity' | 'name',
    value: string,
  ): void {
    const entities = this._cloneEntities(this._config?.entities);
    if (!entities[index]) return;
    entities[index] = { ...entities[index], [field]: value };
    this._updateConfig({ ...this._config!, entities });
  }

  private _removeEntity(index: number): void {
    const entities = this._cloneEntities(this._config?.entities);
    entities.splice(index, 1);
    this._updateConfig({ ...this._config!, entities });
  }

  private _addEntity(): void {
    const entities = this._cloneEntities(this._config?.entities);
    entities.push({ entity: '', name: '' });
    this._updateConfig({ ...this._config!, entities });
  }

  /** Persist the new config and fire the event HA listens to */
  private _updateConfig(config: AirQualityCardConfig): void {
    this._config = config;
    fireEvent(this, 'config-changed', { config });
  }

  /* ---------- render ---------- */

  protected render(): unknown {
    if (!this.hass) {
      return html`
        <div class="loading-state">
          <ha-circular-progress indeterminate></ha-circular-progress>
          <p>Loading entities…</p>
        </div>
      `;
    }

    const config = this._config ?? ({} as AirQualityCardConfig);
    const entities = config.entities ?? [];
    const sensors = this._getSensorEntities();

    return html`
      <div class="editor">
        <!-- Title -->
        <div class="section">
          <h3 class="section-title">Title</h3>
          <ha-textfield
            label="Card title (optional)"
            .value=${config.title ?? ''}
            @input=${this._handleTitleChange}
          ></ha-textfield>
        </div>

        <!-- Layout options -->
        <div class="section">
          <h3 class="section-title">Layout</h3>

          <div class="row">
            <ha-textfield
              type="number"
              label="Columns"
              min="1"
              max="6"
              step="1"
              .value=${String(config.columns ?? DEFAULT_COLUMNS)}
              @input=${this._handleColumnsChange}
            ></ha-textfield>
          </div>

          <div class="row">
            <ha-formfield label="Compact mode">
              <ha-switch
                ?checked=${config.compact ?? DEFAULT_COMPACT}
                @change=${this._handleCompactChange}
              ></ha-switch>
            </ha-formfield>
          </div>

          <div class="row">
            <ha-formfield label="Show trend sparklines">
              <ha-switch
                ?checked=${config.show_sparklines ?? DEFAULT_SHOW_SPARKLINES}
                @change=${this._handleSparklineToggle}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${(config.show_sparklines ?? DEFAULT_SHOW_SPARKLINES)
            ? html`
                <div class="row">
                  <ha-textfield
                    type="number"
                    label="Sparkline window (hours)"
                    min="1"
                    max="168"
                    step="1"
                    .value=${String(
                      config.sparkline_hours ?? DEFAULT_SPARKLINE_HOURS,
                    )}
                    @input=${this._handleSparklineHoursChange}
                  ></ha-textfield>
                </div>
              `
            : nothing}
        </div>

        <!-- Entities -->
        <div class="section">
          <h3 class="section-title">Entities</h3>

          ${entities.length === 0
            ? html`
                <p class="empty-entities">
                  No entities configured. Click <strong>Add entity</strong> below.
                </p>
              `
            : html`
                <div class="entities-header">
                  <span class="col-picker">Entity</span>
                  <span class="col-name">Display name</span>
                  <span class="col-action"></span>
                </div>
              `}

          ${entities.map(
            (entity, index) => html`
              <div class="entity-row">
                <!-- Entity picker -->
                <select
                  class="entity-picker"
                  .value=${entity.entity}
                  @change=${(e: Event) =>
                    this._handleEntityChange(
                      index,
                      'entity',
                      (e.target as HTMLSelectElement).value,
                    )}
                >
                  <option value="" ?selected=${!entity.entity}>
                    Select an entity…
                  </option>
                  ${sensors.map(
                    (s) => html`
                      <option
                        value=${s.id}
                        ?selected=${s.id === entity.entity}
                      >
                        ${s.name}
                      </option>
                    `,
                  )}
                </select>

                <!-- Name override -->
                <ha-textfield
                  class="entity-name"
                  label="Display name"
                  .value=${entity.name ?? ''}
                  @input=${(e: Event) =>
                    this._handleEntityChange(
                      index,
                      'name',
                      (e.target as HTMLInputElement).value,
                    )}
                ></ha-textfield>

                <!-- Remove button -->
                <ha-button
                  class="remove-btn"
                  ?disabled=${entities.length <= 1}
                  @click=${() => this._removeEntity(index)}
                >
                  Remove
                </ha-button>
              </div>
            `,
          )}

          <ha-button class="add-btn" @click=${this._addEntity}>
            Add entity
          </ha-button>
        </div>
      </div>
    `;
  }

  /* ---------- styles ---------- */

  static get styles(): ReturnType<typeof css> {
    return css`
      :host {
        display: block;
      }

      .editor {
        padding: 8px 0;
      }

      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 16px;
        gap: 16px;
        color: var(--secondary-text-color);
      }

      .loading-state p {
        margin: 0;
        font-size: 14px;
      }

      .section {
        margin-bottom: 24px;
        padding: 0 8px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .row {
        margin-bottom: 8px;
        width: 100%;
      }

      ha-textfield {
        width: 100%;
      }

      ha-formfield {
        display: flex;
        align-items: center;
      }

      /* ------ entities list ------ */

      .entities-header {
        display: grid;
        grid-template-columns: 2fr 2fr auto;
        gap: 8px;
        align-items: center;
        margin-bottom: 4px;
        padding: 0 4px;
        font-size: 11px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .entity-row {
        display: grid;
        grid-template-columns: 2fr 2fr auto;
        gap: 8px;
        align-items: start;
        margin-bottom: 8px;
        padding: 8px;
        background: var(
          --ha-card-background,
          var(--card-background-color, transparent)
        );
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        border-radius: 8px;
      }

      .entity-picker {
        width: 100%;
        padding: 8px 4px;
        font-size: 14px;
        font-family: var(--paper-font-body_-_font-family, inherit);
        color: var(--primary-text-color);
        background: var(--input-background-color, var(--secondary-background-color, #f5f5f5));
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        min-height: 40px;
        box-sizing: border-box;
      }

      .entity-picker:focus {
        border-color: var(--primary-color);
      }

      .entity-name {
        width: 100%;
      }

      .remove-btn {
        --mdc-theme-primary: var(--error-color, #db4437);
        white-space: nowrap;
        height: 40px;
      }

      .empty-entities {
        margin: 0 0 12px 0;
        font-size: 13px;
        color: var(--secondary-text-color);
        font-style: italic;
      }

      .add-btn {
        margin-top: 4px;
      }

      /* responsive: stack entity rows on very narrow screens */
      @media (max-width: 500px) {
        .entity-row {
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .entities-header {
          display: none;
        }
      }
    `;
  }
}
