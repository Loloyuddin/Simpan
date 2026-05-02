# 💰 Simpan — Personal Finance PWA

> **Simpan** (Malay: *to save / to store*) is a minimalist, privacy-focused Progressive Web App for tracking personal finances — no accounts, no servers, no data leaving your device.

## 🚀 Live Application

**[https://simpan-839919490083.asia-southeast1.run.app](https://simpan-839919490083.asia-southeast1.run.app)**

---

## 💎 Core Capabilities

Simpan is built around three pillars: **PWA accessibility**, **financial utility**, and **system performance**.

### 📱 Progressive Web App (PWA)

| Feature | Description |
|---|---|
| Installable | Add to home screen on iOS, Android, or Desktop — no app store needed |
| App-like Experience | Full-screen immersive UI, no browser toolbars |
| Offline Access | Service workers keep your history and balance available without internet |

### 💰 Financial Management

- **Intuitive Logging** — Quick-entry forms for recording daily expenses and income on the go
- **Real-time Balance Overview** — Instant total and spending trends calculated from your entries
- **Category Management** — Organize transactions by category to identify and analyze spending habits

### 🔒 Privacy & Performance

- **Privacy First** — All financial data stays local on your device; nothing is transmitted
- **Blazing Fast** — Vite-powered build for near-instant load times and fast HMR during development
- **Responsive UI** — Fluid layout that adapts from mobile to ultra-wide desktop

---

## 🛠️ Technical Architecture

| Component | Technology | Role |
|---|---|---|
| UI Framework | React 18 | Declarative component-based architecture |
| Build Tool | Vite | Lightning-fast bundling and development server |
| Styling | Tailwind CSS | Utility-first responsive design system |
| PWA Support | Workbox | Service worker management and offline caching |
| Deployment | Google Cloud Run | Scalable serverless hosting in Asia-Southeast1 |

---

## 💻 Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Loloyuddin/Simpan.git

# 2. Navigate to project
cd Simpan

# 3. Install dependencies
npm install

# 4. Launch development server
npm run dev
```

The local server starts at **http://localhost:5173**

### Build for Production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

### Docker (Cloud Run)

```bash
docker build -t simpan .
docker run -p 8080:8080 -e PORT=8080 simpan
```

---

## 🗺️ Product Roadmap

| Feature | Status |
|---|---|
| Transaction logging (income & expense) | ✅ Done |
| Category breakdown with pie chart | ✅ Done |
| 6-month income vs expense bar chart | ✅ Done |
| Monthly budget per category with progress bars | ✅ Done |
| PWA install + offline support | ✅ Done |
| Data Export (CSV / JSON) | 🔜 Planned |
| Monthly budgeting notifications | 🔜 Planned |
| Dark mode toggle | 🔜 Planned |
| Advanced interactive analytics | 🔜 Planned |

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<p align="center">Built with React 18 · Vite · Tailwind CSS · Deployed on Google Cloud Run</p>
