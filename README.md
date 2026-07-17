<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=900&size=42&pause=1000&color=B91C1C&center=true&vCenter=true&width=800&height=80&lines=Demand+Forecasting+AI;Powered+by+Databricks+%F0%9F%94%A5;ML+at+Production+Scale+%E2%9A%A1" alt="Typing SVG" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=500&size=18&pause=2000&color=536DFE&center=true&vCenter=true&width=700&height=40&lines=AI-powered+retail+demand+prediction+%7C+Real-time+forecasts+%7C+Multi-day+planning" alt="Subtitle" />

<br/><br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Demand_Forecasting_AI-B91C1C?style=for-the-badge&labelColor=0D0D0D)](https://mohitsharma21.netlify.app/)
[![Databricks](https://img.shields.io/badge/Databricks-Model_Serving-FF3621?style=for-the-badge&logo=databricks&logoColor=white)](https://databricks.com)
[![React](https://img.shields.io/badge/React_19-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_6-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=header&text=&animation=twinkling" width="100%"/>

</div>

---

## ⚡ Overview

**Demand Forecasting AI** is a production-grade, AI-powered retail demand prediction dashboard built with **React + TypeScript + Vite** on the frontend and a **Node.js Express** proxy backend, connected live to a **Databricks Model Serving** endpoint.

It enables retail teams to:
- 🔮 **Forecast single-day or multi-day demand** with one click
- 📊 **Visualise predictions** via animated charts and summary cards
- 🎛️ **Simulate business scenarios** — promotions, discounts, epidemics, price changes
- 📋 **Track forecast history** with full parameter replay
- 🌙 **Switch between light and dark mode** with premium glass-morphism UI

---

## 🎬 Features at a Glance

<div align="center">

| Feature | Description |
|---|---|
| 🤖 **AI Forecasting** | Real-time Databricks ML model inference |
| 📅 **Single & Multi-Day** | Forecast 1 to 30+ days ahead |
| 🎯 **Scenario Simulation** | Toggle Promotions, Epidemics, Discounts |
| 📈 **Interactive Charts** | Recharts-powered animated demand graphs |
| 🕰️ **Forecast History** | Save, replay, and compare past forecasts |
| 🌗 **Dark / Light Mode** | Premium glass-morphism theme toggle |
| ⚡ **Instant Results** | Sub-second inference with streaming UX |
| 📱 **Responsive Design** | Works across desktop, tablet, and mobile |

</div>

---

## 🏗️ Tech Stack

<div align="center">

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEMAND FORECASTING AI                       │
├──────────────────────────┬──────────────────────────────────────┤
│        FRONTEND          │              BACKEND                  │
│                          │                                       │
│  React 19 + TypeScript   │  Node.js + Express (proxy server)    │
│  Vite 6 (build tool)     │  Databricks Model Serving REST API   │
│  Recharts (graphs)       │  CORS + Bearer Token Auth            │
│  Lucide React (icons)    │  Environment-based config            │
│  CSS Variables + Glass   │                                       │
└──────────────────────────┴──────────────────────────────────────┘
```

</div>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Databricks workspace with a deployed forecasting model endpoint
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mohitsharmaa21/Demand-Forecasting-AI.git
cd Demand-Forecasting-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your Databricks credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Your Databricks workspace URL
DATABRICKS_URL=https://your-workspace.azuredatabricks.net

# Databricks Model Serving endpoint path
DATABRICKS_ENDPOINT=/serving-endpoints/your-endpoint-name/invocations

# Your Databricks Personal Access Token
DATABRICKS_TOKEN=dapi...

# (Optional) Local proxy server port
PORT=3001
```

### 4. Start the Development Servers

**Terminal 1 — Backend proxy:**
```bash
node server.js
```

**Terminal 2 — Frontend dev server:**
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
Demand-Forecasting-AI/
├── 📂 src/
│   ├── 📂 components/         # UI Components
│   │   ├── Header.tsx         # App header with theme toggle
│   │   ├── Hero.tsx           # Landing hero section
│   │   ├── ForecastForm.tsx   # Main input form
│   │   ├── ForecastSummary.tsx  # Results summary cards
│   │   ├── ForecastChart.tsx  # Recharts demand graph
│   │   ├── ForecastTable.tsx  # Tabular results view
│   │   ├── ForecastHistory.tsx  # History sidebar
│   │   ├── Footer.tsx         # Footer with developer info
│   │   ├── EmptyState.tsx     # Pre-forecast placeholder
│   │   ├── LoadingState.tsx   # Forecasting spinner
│   │   └── ErrorState.tsx     # Error display
│   ├── 📂 services/
│   │   └── forecastApi.ts     # API call to Databricks
│   ├── 📂 types/
│   │   └── forecast.ts        # TypeScript interfaces
│   ├── 📂 utils/
│   │   └── parsePredictions.ts  # Response parser
│   ├── App.tsx                # Root application component
│   └── index.css              # Global styles & design tokens
├── 📂 api/                    # (Optional) API route helpers
├── server.js                  # Express proxy backend
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript config
├── .env.example               # Environment variable template
└── package.json               # Dependencies & scripts
```

---

## 🎛️ Input Parameters

The forecast model accepts the following inputs via the UI form:

| Parameter | Type | Description |
|---|---|---|
| **Date** | Date picker | Forecast start date |
| **Days to Forecast** | Integer | 1–30 days |
| **Store ID** | Integer | Store identifier |
| **Item ID** | Integer | Product identifier |
| **Base Price** | Decimal | Regular selling price (e.g. 12.99) |
| **Discount %** | Integer | Promotional discount (default: 10%) |
| **Promotion Active** | Toggle | Whether a promotion is running |
| **Epidemic Active** | Toggle | Whether an epidemic/event affects demand |
| **Temperature** | Decimal | Local temperature at time of forecast |

---

## 🖥️ UI Highlights

### 🌟 Premium Design System
- **Glass-morphism cards** with backdrop blur and subtle borders
- **4 ambient background orbs** that float and pulse in sync
- **Dot-mesh texture** overlay for depth
- **Sharp black-to-crimson gradient** hero headline with animated shimmer

### 🎨 Color Palette

| Token | Light Mode | Dark Mode |
|---|---|---|
| Background | `#F5F7FA` | `#131822` |
| Accent Primary | `#536DFE` | `#7D91FF` |
| Text Primary | `#1A2233` | `#F1F4F8` |
| Danger/Epidemic | `#EF4444` | `#F87171` |

### 📱 Responsive
- Fully responsive grid layout
- Mobile-first single-column on small screens
- Wide-panel two-column layout on desktop

---

## 🔌 Databricks Integration

The app connects to a Databricks Model Serving REST endpoint through a local Express proxy to avoid CORS issues.

**Request format sent to Databricks:**
```json
{
  "dataframe_records": [
    {
      "date": "2024-01-15",
      "store": 1,
      "item": 5,
      "onpromotion": 1,
      "oil_price": 65.0,
      "holiday": 0,
      "temperature": 22.5,
      "discount_pct": 10,
      "epidemic": 0,
      "base_price": 12.99
    }
  ]
}
```

**Response parsed to extract:**
- `predictions` — array of forecasted demand values
- Rendered as summary cards, animated chart, and data table

---

## 👨‍💻 Developer

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=28&pause=1000&color=B91C1C&center=true&vCenter=true&width=500&height=60&lines=Mohit+Sharma;Full-Stack+%26+ML+Engineer" alt="Dev name" />

[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-mohitsharma21.netlify.app-536DFE?style=for-the-badge)](https://mohitsharma21.netlify.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohitsharmaa21/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mohitsharmaa21)
[![Email](https://img.shields.io/badge/Gmail-Mohitsharam44@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:Mohitsharam44@gmail.com)

</div>

---

## 📄 License

```
MIT License — © 2026 Mohit Sharma
Demand Forecasting AI — Deployed on Databricks Model Serving
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer&animation=twinkling" width="100%"/>

<br/>

**⭐ Star this repo if you find it useful!**

<img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=600&size=14&pause=3000&color=536DFE&center=true&vCenter=true&width=600&height=30&lines=Built+with+%E2%9D%A4%EF%B8%8F+by+Mohit+Sharma+%7C+Powered+by+Databricks+%7C+%C2%A9+2026" alt="Footer" />

</div>
