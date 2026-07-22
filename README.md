# AirIQ — Urban Air Quality Intelligence

AirIQ is a full-stack urban air-quality intelligence dashboard focused on Indian cities. It brings together live or fallback CPCB station data, a 72-hour AQI outlook, source attribution, satellite hotspots, policy simulation, enforcement workflows, and citizen advisories in one role-based web interface.

> **Prototype notice:** AirIQ is a decision-support demonstration. Forecasts, source-attribution results, health costs, legal notices, and satellite observations must be independently validated before being used for public-health, regulatory, or legal decisions.

## Highlights

- Live AQI and CAAQMS station map with a graceful cached-data fallback
- 72-hour, physics-informed heuristic AQI forecast and school-closure alert flag
- City-level emission source attribution for traffic, construction, industry, biomass/stubble burning, and dust
- Satellite hotspot overlay and multi-city command dashboard
- CPCB/GRAP-style enforcement-notice generator
- Policy-impact simulator for comparing intervention scenarios
- Citizen air-quality advisory generator and WhatsApp notification simulator
- Health-cost, forecast-accuracy, and health-correlation views
- Role-oriented flows for enforcement officers, policy makers, and citizens

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide icons, Motion
- **Backend:** Express, TypeScript, tsx
- **Testing:** Vitest
- **Data:** CPCB/data.gov.in integration when configured, plus bundled reference data for offline/fallback operation

## Getting started

### Prerequisites

- Node.js 20 or later (Node.js 22 recommended)
- npm 10 or later

### Install and run

```bash
git clone https://github.com/Pengui0/AirIQ---Urban-Air-Quality-Intelligence.git
cd AirIQ---Urban-Air-Quality-Intelligence
npm install
```

Copy the example configuration file. In PowerShell:

```powershell
Copy-Item .env.example .env
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Express server starts Vite in middleware mode during development, so the web app and API are served together.

## Environment configuration

Create a local `.env` file from `.env.example`. It is intentionally ignored by Git.

| Variable | Required | Description |
| --- | --- | --- |
| `APP_URL` | No | Public deployment URL, used for application links and callbacks. |
| `CPCB_API_KEY` | No | API key for the CPCB/data.gov.in air-quality feed. Without it, AirIQ uses bundled reference data. |
| `IMD_WEATHER_KEY` | No | Optional IMD weather API key for future or extended weather integrations. |
| `JWT_SECRET` | No | Secret for authenticated/deployed extensions. Generate a strong, unique value for production. |

Never commit `.env` or real credentials. If a key has been exposed, revoke and rotate it through its provider.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 3000. |
| `npm run build` | Build the Vite client and bundle the Express server into `dist/`. |
| `npm start` | Run the production server bundle from `dist/server.cjs`. |
| `npm run lint` | Type-check the project with TypeScript. |
| `npm test` | Run the Vitest suite once. |
| `npm run clean` | Remove generated build output. |

For a production check:

```bash
npm run lint
npm test
npm run build
npm start
```

## Product areas

| Area | What it provides |
| --- | --- |
| Live AQI & Satellite Map | City and station AQI readings, refresh state, and satellite hotspot context. |
| Forecast & Alerts | A 72-hour city forecast with peak AQI and school-alert signals. |
| Source Attribution | Estimated contribution breakdown with contextual reasoning and confidence. |
| Enforcement Center | Draft CPCB/GRAP-style notices with required mitigation actions. |
| Multi-City Command | Comparative monitoring across supported Indian cities. |
| Policy Simulator | Projected intervention effects for policy planning. |
| Citizen & WhatsApp Bot | Localized public-health advice and a message-delivery simulation. |
| Health Cost & Accuracy | Health/economic indicators, forecast accuracy, and AQI-health correlation. |

The bundled city reference dataset includes Delhi NCR, Mumbai, Kolkata, Bengaluru, Chennai, Hyderabad, Ahmedabad, Lucknow, Patna, and Jaipur.

## API reference

The application exposes the following local API endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service status and ingestion-pipeline state. |
| `GET` | `/api/metrics` | Operational dashboard metrics. |
| `GET` | `/api/aqi/live` | Live CPCB AQI data, or cached reference data if the live feed is unavailable. |
| `GET` | `/api/aqi/forecast?city=Delhi%20NCR` | 72-hour forecast for a supported city. |
| `POST` | `/api/attribution` | Source-attribution estimate; accepts `city` and `currentAqi`. |
| `POST` | `/api/enforcement/generate-notice` | Generates an enforcement-notice record. |
| `POST` | `/api/advisory` | Produces a citizen advisory; accepts `city`, `ward`, `aqi`, and `language`. |
| `POST` | `/api/whatsapp` | Simulates dispatching a WhatsApp message. |
| `POST` | `/api/policy/simulate` | Simulates policy intervention outcomes. |
| `GET` | `/api/cost-calculator` | Health and economic cost indicators. |
| `GET` | `/api/satellite` | Satellite hotspot data. |
| `GET` | `/api/accuracy` | Forecast-accuracy metrics. |
| `GET` | `/api/health-correlation` | AQI and health-correlation data. |

Example request:

```bash
curl "http://localhost:3000/api/aqi/forecast?city=Mumbai"
```

## Project structure

```text
.
├── src/
│   ├── components/        # Dashboard panels and interface components
│   ├── data/              # Bundled cities, stations, notices, and reference metrics
│   ├── services/          # CPCB ingestion, forecasting, and policy simulation logic
│   ├── App.tsx            # Application state and role-based navigation
│   └── main.tsx           # React entry point
├── tests/                 # Vitest coverage for core services
├── server.ts               # Express API and development/production server
├── .env.example            # Safe configuration template
└── vite.config.ts          # Vite configuration
```

## Data and limitations

- Live measurements depend on external source availability and API access. AirIQ clearly marks the fallback path when it is serving cached reference data.
- The forecast is a heuristic model, not an official government forecast.
- Attribution, policy, satellite, health, and economic outputs are illustrative model outputs; they are not evidence of legal non-compliance or medical advice.
- The notice generator produces draft content only. A competent authority must review facts, law, jurisdiction, and due process before issuance.

## Security

- Keep production credentials only in your deployment platform’s secret manager or local `.env` file.
- Use a long random `JWT_SECRET` for any production authentication implementation.
- Protect and rate-limit public API endpoints before deploying broadly.
- Do not treat generated notices or simulated WhatsApp delivery as actual external actions.

## Contributing

1. Create a feature branch.
2. Make focused changes with clear commit messages.
3. Run `npm run lint` and `npm test`.
4. Open a pull request describing the change, testing performed, and any data-source impacts.

## License

No license is currently specified. Add a `LICENSE` file before distributing or reusing this project outside the repository’s intended scope.
