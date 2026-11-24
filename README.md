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
