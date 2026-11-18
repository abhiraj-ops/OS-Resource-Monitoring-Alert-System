# ParindeOS — Supabase Database Setup

## Scope

This folder provides the PostgreSQL foundation for the ParindeOS monitoring dashboard:

- `systems`: registered machines and ownership
- `metrics`: time-series CPU, memory, disk and network measurements
- `alerts`: severity, message, status and optional JSON details
- `processes`: process snapshots (PID, name, CPU and memory)

The schema supports multiple monitored machines per Supabase Auth user. All telemetry rows belong to a system through `system_id`.

## Setup

1. Create a Supabase project at https://supabase.com/dashboard.
2. Open **SQL Editor** in the project dashboard.
3. Run `schema.sql`.
4. Run `policies.sql`.
5. In **Project Settings → API**, copy the Project URL and anon key into your local environment.
6. Keep the service-role key server-side only. Never commit real credentials or place the service-role key in a Vite `VITE_*` variable.
7. Sign up at least one test user if you want to use `seed_demo.sql`, then run that optional script.

## Environment

Copy the root `.env.example` to the environment file used by the trusted backend/agent. Fill in the values from Supabase Project Settings → API.

- `SUPABASE_URL`: project URL
- `SUPABASE_ANON_KEY`: public anon key; use with user authentication and RLS
- `SUPABASE_SERVICE_ROLE_KEY`: privileged key for trusted server-side ingestion only

Do not commit `.env` files.

## Data model

- One `auth.users` user can own many `systems`.
- One `systems` row can have many `metrics`, `alerts` and `processes` rows.
- Deleting a system cascades to its telemetry/history.
- `metrics` and `processes` are append-only snapshots in this initial foundation.
- Timestamps use `timestamptz` and default to the database time.

## Security / RLS

RLS is enabled on all four tables. Authenticated users can read their own systems and related records only. They can register, update and delete their own system records. Users can insert their own metrics, processes and alerts; alerts can also be updated by their owner.

The `owns_system(uuid)` helper checks ownership through `systems.user_id`. No anonymous access policies are created.

**Important ingestion decision:** the monitoring agent's authentication and ingestion API have not yet been specified. Do not let an unauthenticated machine write directly using the anon key. For production, send telemetry through a trusted backend endpoint that validates the machine/agent identity and uses the service-role key on the server. Never ship that key to the browser or commit it to Git.

## Realtime

`schema.sql` attempts to add all four tables to the `supabase_realtime` publication if they are not already present. In the Supabase dashboard, verify Database → Replication / Publications and enable the required tables if the project setup does not permit the SQL change.

Subscribe only to the tables and rows the signed-in user is authorized to view. RLS remains the access-control boundary.

## Suggested dashboard queries

- Latest metrics: filter `metrics` by `system_id`, order by `collected_at` descending, and limit the result.
- Recent alerts: filter by `system_id`, order by `triggered_at` descending.
- Current processes: select the latest snapshot for the selected system; a later agent contract may add a snapshot/batch identifier to make this exact.
- Systems list: filter by the authenticated user's `user_id` (RLS also enforces ownership).

## Validation checklist

- [ ] Run `schema.sql` without errors.
- [ ] Run `policies.sql` without errors.
- [ ] Confirm all four tables exist under Database → Tables.
- [ ] Confirm RLS is enabled for all four tables.
- [ ] Create two test users and verify neither can read the other's systems or telemetry.
- [ ] Run `seed_demo.sql` after creating a test user.
- [ ] Confirm Realtime publication includes the four tables.
- [ ] Confirm no real credentials are committed.

## Open integration decision

The team still needs to define how the monitoring agent sends metrics (direct authenticated client vs. backend ingestion API), its authentication method, and the expected collection interval. The current schema intentionally does not invent an agent-token design.
# 🖥️ OS Resource Monitoring & Alert System

### Real-Time Linux System Monitoring · Performance Analytics · Intelligent Alerts

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Ubuntu%20Linux-orange?logo=ubuntu" />
  <img src="https://img.shields.io/badge/Language-Python%203-blue?logo=python" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql" />
  <img src="https://img.shields.io/badge/Backend-Supabase-3FCF8E?logo=supabase" />
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" />
</p>

<p align="center">
  <a href="https://github.com/abhiraj-ops/OS-Resource-Monitoring-Alert-System/stargazers">
    <img src="https://img.shields.io/github/stars/abhiraj-ops/OS-Resource-Monitoring-Alert-System?style=social" />
  </a>
  <a href="https://github.com/abhiraj-ops/OS-Resource-Monitoring-Alert-System/network/members">
    <img src="https://img.shields.io/github/forks/abhiraj-ops/OS-Resource-Monitoring-Alert-System?style=social" />
  </a>
  <a href="https://github.com/abhiraj-ops/OS-Resource-Monitoring-Alert-System/commits/main">
    <img src="https://img.shields.io/github/last-commit/abhiraj-ops/OS-Resource-Monitoring-Alert-System" />
  </a>
  <img src="https://img.shields.io/github/license/abhiraj-ops/OS-Resource-Monitoring-Alert-System" />
</p>

---

## 📌 Overview

**OS Resource Monitoring & Alert System** is a Linux-based system monitoring application designed to monitor, analyze, and visualize operating system resource utilization.

The project uses a Python-based monitoring agent running on Ubuntu Linux to collect system performance information such as:

- CPU utilization
- RAM and memory usage
- Disk storage utilization
- Network traffic
- Running processes
- System uptime and load average

The collected information is intended to be stored in Supabase and displayed through a modern React dashboard.

The system also includes a configurable alert engine to identify abnormal resource consumption and highlight potential performance bottlenecks.

**Our goal:** Build an interactive monitoring platform that makes operating system performance easier to understand, analyze, and manage.

## 🎯 Project Objectives

- Monitor Linux system resources in real time.
- Collect and analyze CPU, RAM, disk, and network statistics.
- Track active processes and their resource consumption.
- Identify unusually high resource utilization.
- Generate WARNING and CRITICAL alerts using configurable thresholds.
- Store historical system performance data.
- Display resource utilization through interactive charts.
- Provide a secure and user-friendly monitoring dashboard.

## ✨ Key Features

### 1. 📊 Real-Time System Monitoring

- CPU utilization and core information.
- RAM usage and available memory.
- Disk storage and partition utilization.
- Network upload and download statistics.
- System uptime and load average.

### 2. ⚙️ Process Monitoring

- Display currently running processes.
- Process ID (PID) identification.
- Individual process CPU consumption.
- Individual process memory consumption.
- Identify resource-intensive processes.

### 3. 🚨 Intelligent Alert Engine

- Configurable CPU usage thresholds.
- Configurable memory thresholds.
- Disk utilization monitoring.
- WARNING and CRITICAL alert levels.
- Alert history and acknowledgement.

### 4. 📈 Interactive Dashboard

- Live CPU, RAM, disk, and network cards.
- Dynamic resource utilization charts.
- System health indicators.
- Process monitoring table.
- Recent alerts and notifications.
- Historical performance analytics.

### 5. 🔐 Backend & Authentication

- Supabase Authentication.
- PostgreSQL database.
- Supabase Realtime subscriptions.
- Row Level Security (RLS).
- Secure storage of system metrics and alerts.

### 6. 🚀 Advanced Enhancements

- Resource utilization trend analysis.
- Anomaly detection as an optional machine-learning enhancement.
- Performance bottleneck identification.
- Automated recovery recommendations.
- Future support for monitoring multiple Linux machines.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Operating System | Ubuntu Linux |
| Programming Language | Python 3 |
| System Monitoring | psutil |
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Data Visualization | Recharts |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Live Synchronization | Supabase Realtime |
| Version Control | Git & GitHub |

---

## 🏗️ System Architecture

```text
                  UBUNTU LINUX
                       |
                       v
              PYTHON MONITORING AGENT
                       |
          +------------+------------+
          |            |            |
          v            v            v
         CPU          RAM          DISK
          |            |            |
          +------------+------------+
                       |
                       v
              NETWORK & PROCESSES
                       |
                       v
                METRICS COLLECTION
                       |
                       v
              ALERT THRESHOLD ENGINE
                       |
                +------+------+
                |             |
                v             v
             SUPABASE       ALERTS
             DATABASE
                |
                v
          SUPABASE REALTIME
                |
                v
           REACT DASHBOARD
                |
          +-----+------+
          |            |
          v            v
       ANALYTICS    ALERT UI
          |
          v
     PERFORMANCE HISTORY
```

## 📂 Project Structure

The following is the planned modular project structure. Files will be added as the corresponding modules are developed.

```text
OS-Resource-Monitoring-Alert-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── charts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── monitoring-agent/
│   ├── collectors/
│   │   ├── cpu.py
│   │   ├── memory.py
│   │   ├── disk.py
│   │   ├── network.py
│   │   └── processes.py
│   │
│   ├── alerts/
│   │   └── threshold_engine.py
│   │
│   ├── services/
│   │   └── supabase_client.py
│   │
│   ├── config/
│   │   └── settings.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── supabase/
│   └── schema.sql
│
├── docs/
│   ├── architecture.md
│   └── screenshots/
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following tools are installed:

- Ubuntu Linux 22.04 or later
- Python 3.10 or later
- Node.js 20 or later
- npm
- Git
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/abhiraj-ops/OS-Resource-Monitoring-Alert-System.git

cd OS-Resource-Monitoring-Alert-System
```

### 2. Install System Dependencies

```bash
sudo apt update

sudo apt install python3 python3-pip python3-venv git -y
```

### 3. Setup Python Monitoring Agent

```bash
cd monitoring-agent

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

Start the monitoring agent:

```bash
python main.py
```

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend

npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Start the frontend development server:

```bash
npm run dev
```

### 5. Configure Supabase

1. Create a new Supabase project.
2. Configure the PostgreSQL database.
3. Create the required tables using `supabase/schema.sql`.
4. Configure Supabase Authentication.
5. Enable Row Level Security (RLS).
6. Configure Realtime for the required tables.
7. Add the required environment variables.

**Security Note:** Never expose the Supabase service-role key in frontend code or commit secret credentials to GitHub.

---

## 📊 System Metrics

| Metric | Description |
|---|---|
| CPU | Overall and core-wise utilization |
| Memory | Used, free, and available RAM |
| Swap | Swap memory utilization |
| Disk | Partition storage utilization |
| Network | Upload and download traffic |
| Processes | PID, CPU, and memory consumption |
| Uptime | Total system running duration |
| Load Average | System workload over time |

## 🚨 Alert Classification

| Alert Level | Description |
|---|---|
| 🟢 INFO | General system information |
| 🟡 WARNING | Resource utilization approaching a configured threshold |
| 🔴 CRITICAL | Resource utilization exceeding a critical threshold |

Alert thresholds will be configurable so that users can adjust monitoring according to their system requirements.

---

## 🧠 Operating System Concepts

This project demonstrates practical applications of important Operating System concepts:

- **Process Management:** Monitoring active processes and their resource consumption.
- **CPU Management:** Understanding CPU utilization and system workload.
- **Memory Management:** Tracking RAM and swap utilization.
- **Disk Management:** Monitoring storage capacity and usage.
- **Resource Allocation:** Understanding how system resources are consumed.
- **Performance Monitoring:** Analyzing system performance over time.
- **Process Scheduling Concepts:** Observing process activity and CPU consumption.

---

## 👥 Development Team

This project is collaboratively developed by three team members, with clearly defined responsibilities for each development area.

| Member | Role | Responsibilities | GitHub |
|---|---|---|---|
| **Abhiraj Chauhan** | Project Lead & OS Monitoring Developer | Ubuntu monitoring, Python, psutil, CPU/RAM/Disk/Network collectors, process monitoring and integration | [@abhiraj-ops](https://github.com/abhiraj-ops) |
| **Divy** | Frontend Developer | React, Vite, Tailwind CSS, dashboard, charts, process table and alert UI | [@divymsid](https://github.com/divymsid) |
| **Kaashvi** | Backend & Database Developer | Supabase, PostgreSQL, authentication, RLS, database schema and realtime integration | [@kaashvi5](https://github.com/kaashvi5) |

**Team Collaboration:** All team members contribute to testing, documentation, code reviews, debugging, and final integration.

---

## 🤝 Contribution Guidelines

We follow a collaborative Git workflow to maintain clean and organized development.

1. Clone the repository.
2. Create a separate feature branch.
3. Work on your assigned module.
4. Commit changes with meaningful messages.
5. Push your branch to GitHub.
6. Create a Pull Request for review.
7. Merge changes into the main branch after review.

Suggested branches:

```text
main
│
├── feature/linux-monitoring
├── feature/frontend-dashboard
└── feature/supabase-backend
```

Example:

```bash
git checkout -b feature/your-module

git add .

git commit -m "Add your feature description"

git push origin feature/your-module
```

---

## 🔮 Future Enhancements

- Machine learning-based anomaly detection.
- Predictive resource utilization.
- Multi-machine monitoring.
- Email and desktop notifications.
- Automated process management with user approval.
- Advanced performance reports.
- Historical resource comparison.
- Configurable monitoring intervals.

---

## 📸 Screenshots

Screenshots of the monitoring agent, dashboard, analytics, and alert interface will be added here as development progresses.

```text
docs/
└── screenshots/
    ├── dashboard.png
    ├── cpu-monitoring.png
    ├── process-monitoring.png
    └── alerts.png
```

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Built with ❤️ using Python, React, Ubuntu Linux & Supabase.</b>
  <br/>
  <i>Monitoring systems. Understanding performance. Detecting problems.</i>
</p>

<p align="center">
  ⭐ If you find this project interesting, consider giving the repository a star!!!
</p>
