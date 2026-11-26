# OS Resource Monitoring & Alert System — Team Roles & Responsibilities

**Project:** OS Resource Monitoring & Alert System (ParindeOS)  
**Repo:** https://github.com/abhiraj-ops/OS-Resource-Monitoring-Alert-System  
**Deployment:** Netlify (frontend) + Streamlit Cloud (backend/dashboard)  

---

## Team Structure

| Member | Roll No | Primary Role | Secondary Focus |
|--------|---------|--------------|-----------------|
| **Kaashvi Gupta** | 2401730180 | **Backend** | Database, APIs, Monitoring Agent |
| **Divyam Sidhant Yadav** | 2401730220 | **Frontend** | UI, Website, Dashboards, Charts |
| **Anirudh Chauhan** | 2401730062 | **UI + Backend** | Theme system, Scheduling Algorithms, Integration |

---

## Detailed Responsibilities

### Kaashvi Gupta — Backend Lead (2401730180)
- **Monitoring Agent** (`monitoring-agent/`)
  - Python `main.py` entry point
  - Collectors: CPU, Memory, Disk, Network, Processes
  - Threshold engine & alert generation
  - Supabase client integration
  - `config/settings.py` configuration
- **API & Database Layer**
  - Supabase schema (`schema.sql`)
  - Row Level Security policies (`policies.sql`)
  - Seed data (`seed_demo.sql`)
  - API key management (server-side only — never on frontend)
- **Backend Deployment**
  - Streamlit Cloud deployment (`streamlit_app.py`)
  - `requirements-streamlit.txt`
- **Compliance & Security**
  - API keys off frontend
  - Rate limiting design
  - Data deletion request flow
  - Privacy policy & terms alignment

### Divyam Sidhant Yadav — Frontend Lead (2401730220)
- **Website (React + Vite)**
  - `frontend/src/` — all pages & components
  - React Router routing (`routes.jsx`)
  - State management & localStorage persistence
- **UI Pages**
  - Login, SignUp, PasswordReset, EmailVerification
  - Dashboard, Processes, Analytics, Alerts, Settings
  - PrivacyPolicy, TermsOfService, RefundPolicy, Onboarding, NotFound
  - Team page
- **Components**
  - Navbar (sticky header, theme toggle, live status)
  - MetricCard, ResourceChart, AlertPanel, ProcessTable
  - EmptyState, LoadingSpinner, ErrorMessage, CookieConsent
  - AgeConsent, DataDeletionRequest, BusinessDetails
- **Themes**
  - 4-theme system: Midnight, Aurora, Frost, Graphite (`useTheme.jsx`)
  - Glassmorphism CSS (`index.css`)
- **Charts & Graphs**
  - Recharts integration (Recharts: Line, Pie, Area charts)
  - CPU/RAM trend lines, disk donuts, network throughput
  - Gantt chart for scheduling simulation
- **Frontend Deployment**
  - Netlify deployment config (build command, publish `dist`, SPA redirect)
  - `frontend/package.json`, `frontend/.env.local`
  - Desktop launcher (`OS_Project_Website.bat`)

### Anirudh Chauhan — UI + Backend (2401730062)
- **UI / Theme System**
  - `useTheme.jsx` — theme context provider (midnight, aurora, frost, graphite)
  - Sticky blurred header with live status
  - Glassmorphism components
  - Advanced MetricCard with status badges
- **Scheduling Algorithms (Core OS Logic)**
  - FCFS (First Come First Served) — Non-preemptive
  - SJF (Shortest Job First) — Non-preemptive
  - Priority Scheduling — Non-preemptive
  - Round Robin — Preemptive (with time quantum)
  - SRTF (Shortest Remaining Time First) — Preemptive
- **Metrics Engine**
  - CT (Completion Time), TAT (Turnaround Time), WT (Waiting Time), RT (Response Time)
  - Average statistics cards
  - Simulation runner (`runSimulation`)
- **Integration**
  - Connecting scheduling logic to frontend Processes page
  - Gantt chart visualization bridge between backend algo and frontend UI
  - CSV export for simulation results

---

## Shared / Cross-Cutting Responsibilities

| Area | Owner | Notes |
|------|-------|-------|
| Git & Version Control | All | Branch: `main`, commits pushed to origin |
| Build & Deploy | Divyam (Frontend/Netlify), Kaashvi (Backend/Streamlit) | `npm run build`, `vite build` |
| Testing | Divyam + Anirudh | Unit tests, boundary cases, build verification |
| Documentation | All | README.md, compliance pages, deployment guide |
| Error Tracking | Kaashvi + Divyam | `useErrorTracking`, `useAnalytics` |
| Auth & Security | Kaashvi | `useAuth`, password reset, email verification, RLS |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router DOM, Tailwind CSS, Recharts, Lucide React, Framer Motion |
| Backend | Python, Streamlit, psutil, supabase-py |
| Database | Supabase (PostgreSQL) + localStorage fallback (demo mode) |
| Deployment | Netlify (frontend), Streamlit Cloud (backend) |
| Styling | 4-theme CSS variables, glassmorphism, sticky blurred headers |

---

## How to Run

**Frontend (Local):**
```
Double-click: C:\Users\ABHISHEK\Desktop\OS_Project_Website.bat
# Or manually:
cd frontend && npm install && npm run dev
# Opens at http://localhost:5173
```

**Backend (Streamlit):**
```
streamlit run streamlit_app.py
# Deploys to https://<app-name>.streamlit.app
```

**Build:**
```
cd frontend && npx vite build
# Output: dist/
```

---

*Generated for OS Resource Monitoring & Alert System capstone project.*
