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
  DEFAULT_SMOOTH_SPARKLINES,
  DEFAULT_STEP_SPARKLINES,
} from './const';

@customElement('air-quality-monitor-card-editor')
export class AirQualityMonitorCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: AirQualityCardConfig;

  public setConfig(config: AirQualityCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const configValue = target.dataset.configValue;
    if (!configValue) return;

    let value: any = target.value;
    if (target.type === 'number') {
      value = value === '' ? undefined : Number(value);
      if (value !== undefined && isNaN(value as number)) return;
    }
    if (target.type === 'checkbox') {
      value = (target as HTMLInputElement).checked;
    }

    if (this._config && (this._config as any)[configValue] === value) return;

    this._config = { ...this._config!, [configValue]: value };
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
    if (field === 'show_sparkline' || field === 'show_unit') {
      value = (ev.target as HTMLInputElement).checked;
    }
    this._updateEntity(index, { [field]: value });
  }

  private _updateEntity(index: number, patch: Partial<MetricEntityConfig>): void {
    const entities = this._config?.entities?.map((e, i) =>
      i === index ? { ...e, ...patch } : e,
    );
    if (!entities) return;
    this._config = { ...this._config!, entities };
    fireEvent(this, 'config-changed', { config: this._config });
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
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            class="ha-input"
            placeholder="Air Quality Monitor"
            .value=${config.title ?? ''}
            data-config-value="title"
            @input=${this._valueChanged}
          />
        </div>

        <!-- Layout -->
        <div class="section">
          <div class="section-title">Layout</div>

          <div class="field">
            <label>Columns</label>
            <input
              type="number"
              class="ha-input"
              min="1"
              max="6"
              .value=${String(config.columns ?? DEFAULT_COLUMNS)}
              data-config-value="columns"
              @input=${this._valueChanged}
            />
          </div>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${config.compact ?? DEFAULT_COMPACT}
              data-config-value="compact"
              @change=${this._valueChanged}
            />
            <span>Compact mode</span>
          </label>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${config.show_sparklines ?? DEFAULT_SHOW_SPARKLINES}
              data-config-value="show_sparklines"
              @change=${this._valueChanged}
            />
            <span>Show trend sparklines</span>
          </label>

          ${(config.show_sparklines ?? DEFAULT_SHOW_SPARKLINES)
            ? html`
                <div class="field">
                  <label>Sparkline window (hours)</label>
                  <input
                    type="number"
                    class="ha-input"
                    min="1"
                    max="168"
                    .value=${String(config.sparkline_hours ?? DEFAULT_SPARKLINE_HOURS)}
                    data-config-value="sparkline_hours"
                    @input=${this._valueChanged}
                  />
                </div>
              `
            : nothing}

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${config.smooth_sparklines ?? DEFAULT_SMOOTH_SPARKLINES}
              data-config-value="smooth_sparklines"
              @change=${this._valueChanged}
            />
            <span>Smooth sparklines</span>
          </label>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${config.step_sparklines ?? DEFAULT_STEP_SPARKLINES}
              data-config-value="step_sparklines"
              @change=${this._valueChanged}
            />
            <span>Step interpolation</span>
          </label>
        </div>

        <!-- Entities -->
        <div class="section">
          <div class="section-title">Entities</div>

          ${entities.map(
            (entity, index) => html`
              <div class="entity-row">
                <div class="field">
                  <label>Entity</label>
                  <ha-entity-picker
                    .hass=${this.hass}
                    .value=${entity.entity}
                    allow-custom-entity
                    @value-changed=${(ev: CustomEvent) => this._entityChanged(index, ev)}
                  ></ha-entity-picker>
                </div>

                <div class="field">
                  <label>Display name</label>
                  <input
                    type="text"
                    class="ha-input"
                    placeholder="Auto"
                    .value=${entity.name ?? ''}
                    @input=${(ev: Event) => this._entityFieldChanged(index, 'name', ev)}
                  />
                </div>

                <div class="minmax-row">
                  <div class="field">
                    <label>Min value</label>
                    <input
                      type="number"
                      class="ha-input"
                      placeholder="Auto"
                      .value=${entity.min !== undefined ? String(entity.min) : ''}
                      @input=${(ev: Event) => this._entityFieldChanged(index, 'min', ev)}
                    />
                  </div>
                  <div class="field">
                    <label>Max value</label>
                    <input
                      type="number"
                      class="ha-input"
                      placeholder="Auto"
                      .value=${entity.max !== undefined ? String(entity.max) : ''}
                      @input=${(ev: Event) => this._entityFieldChanged(index, 'max', ev)}
                    />
                  </div>
                </div>

                <label class="toggle">
                  <input
                    type="checkbox"
                    .checked=${entity.show_sparkline !== false}
                    @change=${(ev: Event) => this._entityFieldChanged(index, 'show_sparkline', ev)}
                  />
                  <span>Show sparkline</span>
                </label>

                <label class="toggle">
                  <input
                    type="checkbox"
                    .checked=${entity.show_unit !== false}
                    @change=${(ev: Event) => this._entityFieldChanged(index, 'show_unit', ev)}
                  />
                  <span>Show unit</span>
                </label>

                <button
                  class="remove-btn"
                  ?disabled=${entities.length <= 1}
                  @click=${() => this._removeEntity(index)}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                  Remove
                </button>
              </div>
            `,
          )}

          <button class="add-btn" @click=${this._addEntity}>
            <ha-icon icon="mdi:plus"></ha-icon>
            Add entity
          </button>
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
        gap: 10px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin: 0 0 2px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .ha-input {
        width: 100%;
        padding: 8px 12px;
        font-size: 14px;
        font-family: var(--paper-font-body_-_font-family, inherit);
        color: var(--primary-text-color);
        background: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }

      .ha-input:focus {
        border-color: var(--primary-color);
      }

      .ha-input::placeholder {
        color: var(--disabled-text-color, #9e9e9e);
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .toggle input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
      }

      .entity-row {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        background: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .minmax-row {
        display: flex;
        gap: 8px;
      }

      .minmax-row > .field {
        flex: 1;
      }

      .remove-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        font-size: 13px;
        font-family: inherit;
        color: var(--error-color, #db4437);
        background: transparent;
        border: 1px solid var(--error-color, #db4437);
        border-radius: 4px;
        cursor: pointer;
        align-self: flex-start;
        transition: background 0.2s;
      }

      .remove-btn:hover:not(:disabled) {
        background: rgba(219, 68, 55, 0.08);
      }

      .remove-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .remove-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      .add-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        font-size: 13px;
        font-family: inherit;
        color: var(--primary-color);
        background: transparent;
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .add-btn:hover {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      }

      .add-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      ha-entity-picker {
        width: 100%;
      }
    `;
  }
}