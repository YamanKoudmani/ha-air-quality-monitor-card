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

  private _valueChanged(ev: CustomEvent): void {
    const target = ev.target as any;
    const configValue = target.configValue;
    if (!configValue) return;

    let value: any;
    if (target.tagName === 'HA-ENTITY-PICKER') {
      value = ev.detail.value;
    } else if (target.tagName === 'HA-SWITCH') {
      value = target.checked;
    } else {
      value = target.value;
    }

    if (this._config && (this._config as any)[configValue] === value) return;

    this._config = { ...this._config!, [configValue]: value };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _updateEntity(index: number, patch: Partial<MetricEntityConfig>): void {
    const entities = this._config?.entities?.map((e, i) =>
      i === index ? { ...e, ...patch } : e,
    );
    if (!entities) return;
    this._config = { ...this._config!, entities };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _entityChanged(index: number, ev: CustomEvent): void {
    this._updateEntity(index, { entity: ev.detail.value });
  }

  private _entityFieldChanged(index: number, field: string, ev: Event): void {
    const target = ev.target as HTMLInputElement;
    let value: any = target.value;
    if (field === 'min' || field === 'max') {
      value = value === '' ? undefined : Number(value);
      if (value !== undefined && isNaN(value)) return;
    }
    if (field === 'name') {
      value = value || undefined;
    }
    this._updateEntity(index, { [field]: value });
  }

  private _removeEntity(index: number): void {
    const entities = [...(this._config?.entities || [])];
    entities.splice(index, 1);
    this._config = { ...this._config!, entities };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _addEntity(): void {
    const entities = [...(this._config?.entities || []), { entity: '' }];
    this._config = { ...this._config!, entities };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  protected render(): unknown {
    if (!this.hass) {
      return html`<div class="loading">Loading…</div>`;
    }

    const config = this._config ?? ({} as AirQualityCardConfig);
    const entities = config.entities ?? [];

    return html`
      <div class="editor">
        <!-- Title -->
        <div class="section">
          <ha-textfield
            label="Card title (optional)"
            .value=${config.title ?? ''}
            .configValue=${'title'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <!-- Layout -->
        <div class="section">
          <h3 class="section-title">Layout</h3>

          <ha-textfield
            type="number"
            label="Columns (1-6)"
            min="1"
            max="6"
            .value=${String(config.columns ?? DEFAULT_COLUMNS)}
            .configValue=${'columns'}
            @input=${this._valueChanged}
          ></ha-textfield>

          <ha-formfield label="Compact mode">
            <ha-switch
              .checked=${config.compact ?? DEFAULT_COMPACT}
              .configValue=${'compact'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show trend sparklines">
            <ha-switch
              .checked=${config.show_sparklines ?? DEFAULT_SHOW_SPARKLINES}
              .configValue=${'show_sparklines'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>

          ${(config.show_sparklines ?? DEFAULT_SHOW_SPARKLINES)
            ? html`
                <ha-textfield
                  type="number"
                  label="Sparkline window (hours)"
                  min="1"
                  max="168"
                  .value=${String(config.sparkline_hours ?? DEFAULT_SPARKLINE_HOURS)}
                  .configValue=${'sparkline_hours'}
                  @input=${this._valueChanged}
                ></ha-textfield>
              `
            : nothing}
        </div>

        <!-- Entities -->
        <div class="section">
          <h3 class="section-title">Entities</h3>

          ${entities.map(
            (entity, index) => html`
              <div class="entity-row">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${entity.entity}
                  label="Entity"
                  allow-custom-entity
                  @value-changed=${(ev: CustomEvent) => this._entityChanged(index, ev)}
                ></ha-entity-picker>

                <div class="entity-fields">
                  <ha-textfield
                    label="Display name (optional)"
                    .value=${entity.name ?? ''}
                    @input=${(ev: Event) => this._entityFieldChanged(index, 'name', ev)}
                  ></ha-textfield>

                  <div class="minmax-row">
                    <ha-textfield
                      type="number"
                      label="Min value"
                      .value=${entity.min !== undefined ? String(entity.min) : ''}
                      @input=${(ev: Event) => this._entityFieldChanged(index, 'min', ev)}
                    ></ha-textfield>

                    <ha-textfield
                      type="number"
                      label="Max value"
                      .value=${entity.max !== undefined ? String(entity.max) : ''}
                      @input=${(ev: Event) => this._entityFieldChanged(index, 'max', ev)}
                    ></ha-textfield>
                  </div>
                </div>

                <ha-button
                  class="remove-btn"
                  ?disabled=${entities.length <= 1}
                  @click=${() => this._removeEntity(index)}
                >
                  <ha-icon icon="mdi:delete" style="--mdc-icon-size:18px;margin-right:4px;"></ha-icon>
                  Remove
                </ha-button>
              </div>
            `,
          )}

          <ha-button class="add-btn" @click=${this._addEntity}>
            <ha-icon icon="mdi:plus" style="--mdc-icon-size:18px;margin-right:4px;"></ha-icon>
            Add entity
          </ha-button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 8px 0;
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin: 0 0 4px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      ha-textfield {
        width: 100%;
      }

      ha-formfield {
        display: block;
        margin-top: 4px;
      }

      .entity-row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .entity-fields {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .minmax-row {
        display: flex;
        gap: 8px;
      }

      .minmax-row > ha-textfield {
        flex: 1;
      }

      .remove-btn {
        --mdc-theme-primary: var(--error-color, #db4437);
        align-self: flex-start;
      }

      .add-btn {
        margin-top: 4px;
      }
    `;
  }
}