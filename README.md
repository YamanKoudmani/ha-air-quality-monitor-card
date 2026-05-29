# Air Quality Monitor Card

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card for monitoring air quality sensors with color-coded gauges and trend sparklines.

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

## Features

- **Circular arc gauges** for each air quality metric (PM2.5, PM10, CO2, VOC, temperature, humidity, etc.)
- **Color-coded severity levels** — Good (green), Moderate (yellow), Sensitive (orange), Unhealthy (red), Very Unhealthy (purple), Hazardous (maroon)
- **Trend sparklines** showing historical data over a configurable time window
- **Visual editor** for easy configuration in the Lovelace UI
- **Responsive layout** with configurable grid columns
- **Compact mode** for dense dashboards
- **Auto-detection** of common air quality metrics with sensible defaults
- **Theme-aware** — uses your Home Assistant theme colors

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to **Frontend** > click the three dots menu > **Custom repositories**
3. Add this repository URL with category **Lovelace**
4. Search for **Air Quality Monitor Card** and install it
5. Refresh your browser

### Manual

1. Download `air-quality-monitor-card.js` from the [latest release](../../releases)
2. Copy it to your `config/www/` directory
3. Add it as a dashboard resource:
   - Go to **Settings** > **Dashboards** > **Resources** > **Add Resource**
   - URL: `/local/air-quality-monitor-card.js`
   - Type: **JavaScript Module**
4. Refresh your browser

## Configuration

### Visual Editor

The card includes a visual editor. Add it via the Lovelace card picker:

1. Edit your dashboard
2. Click **Add Card**
3. Search for **Air Quality Monitor Card**
4. Use the editor to configure entities and options

### YAML Configuration

```yaml
type: custom:air-quality-monitor-card
title: Living Room Air Quality
columns: 3
show_sparklines: true
sparkline_hours: 24
compact: false
entities:
  - entity: sensor.living_room_pm25
    name: PM2.5
    icon: mdi:air-filter
    unit: "\u00b5g/m\u00b3"
    min: 0
    max: 150
    severity:
      good: 12
      moderate: 35
      unhealthy_sensitive: 55
      unhealthy: 150
  - entity: sensor.living_room_co2
    name: "CO\u2082"
    icon: mdi:molecule-co2
    unit: ppm
    min: 400
    max: 5000
    severity:
      good: 800
      moderate: 1500
      unhealthy_sensitive: 2000
      unhealthy: 5000
  - entity: sensor.living_room_voc
    name: VOC
    icon: mdi:flask-outline
    unit: ppb
  - entity: sensor.living_room_temperature
    name: Temperature
  - entity: sensor.living_room_humidity
    name: Humidity
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | _(none)_ | Card title displayed at the top |
| `columns` | number | `3` | Number of columns in the grid (1-6) |
| `show_sparklines` | boolean | `true` | Show trend sparklines below each gauge |
| `sparkline_hours` | number | `24` | History window for sparklines (1-168 hours) |
| `compact` | boolean | `false` | Compact mode with smaller gauges |
| `entities` | array | **required** | List of metric entities to display |

### Entity Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **required** | Entity ID of the sensor |
| `name` | string | _(auto)_ | Display name (defaults to friendly name) |
| `icon` | string | _(auto)_ | MDI icon (auto-detected for common metrics) |
| `unit` | string | _(auto)_ | Unit of measurement |
| `min` | number | _(auto)_ | Minimum gauge value |
| `max` | number | _(auto)_ | Maximum gauge value |
| `precision` | number | _(auto)_ | Decimal places for the value display |
| `color` | string | _(auto)_ | Override the severity color |
| `severity` | object | _(auto)_ | Custom severity thresholds |

### Severity Thresholds

The `severity` object accepts these levels (values define upper bounds):

| Level | Default Color | Description |
|-------|--------------|-------------|
| `good` | Green (#4caf50) | Air quality is satisfactory |
| `moderate` | Yellow (#ffeb3b) | Acceptable quality |
| `unhealthy_sensitive` | Orange (#ff9800) | Unhealthy for sensitive groups |
| `unhealthy` | Red (#f44336) | Unhealthy for everyone |
| `very_unhealthy` | Purple (#9c27b0) | Health alert |
| `hazardous` | Maroon (#7e0023) | Emergency conditions |

If no severity thresholds are configured, the card uses EPA-inspired defaults for recognized metrics (PM2.5, PM10, CO2, VOC, temperature, humidity).

## Auto-Detected Metrics

The card automatically configures defaults for these common air quality metrics based on entity ID patterns:

- **PM2.5** — entities containing `pm25`, `pm2.5`, `pm2_5`
- **PM10** — entities containing `pm10`
- **CO2** — entities containing `co2`, `carbon_dioxide`
- **VOC** — entities containing `voc`, `volatile`
- **Temperature** — entities containing `temp`
- **Humidity** — entities containing `humid`
- **AQI** — entities containing `aqi`, `air_quality`
- **NO2, O3, SO2, CO, Formaldehyde** — various patterns

Unrecognized entities still work — they just won't have default severity thresholds.

## Development

```bash
# Install dependencies
npm install

# Development build with watch mode
npm start

# Production build
npm run build
```

The built file will be in `dist/air-quality-monitor-card.js`.

## License

MIT
