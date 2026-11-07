
# 🖥️ OS Resource Monitoring & Alert System

<p align="center">
  <b>Real-Time Linux System Monitoring, Performance Analytics & Intelligent Alerts</b>
</p>

<p align="center">
  A centralized monitoring platform that tracks Ubuntu system resources, detects abnormal utilization, and generates real-time performance alerts.
</p>

---

## 📌 Overview

The **OS Resource Monitoring & Alert System** is a Linux-based system monitoring application designed to track, analyze, and visualize operating system resource utilization in real time.

The project uses a Python-based monitoring agent running on Ubuntu Linux to collect system performance metrics, including CPU usage, memory utilization, disk activity, network traffic, and running processes.

Collected metrics are securely transmitted to Supabase for database storage and real-time synchronization. A React-based web dashboard displays system performance, resource utilization trends, process information, and alerts.

The platform aims to help users identify resource bottlenecks, detect abnormal system behavior, and understand operating system performance through an interactive monitoring interface.

## 🎯 Project Objectives

- Monitor Ubuntu system resources in real time.
- Collect CPU, RAM, disk, and network statistics.
- Track active processes and their resource consumption.
- Detect resource utilization beyond configured thresholds.
- Generate WARNING and CRITICAL alerts.
- Store historical system performance data.
- Visualize system performance through interactive charts.
- Provide secure authentication and user-specific monitoring data.

## ✨ Key Features

### 1. Real-Time System Monitoring
- CPU utilization and individual core usage.
- RAM usage, available memory, and swap utilization.
- Disk space and partition monitoring.
- Network upload and download speeds.
- System uptime and load average.

### 2. Process Monitoring
- Display currently running processes.
- Process ID (PID) identification.
- Per-process CPU utilization.
- Per-process memory consumption.
- Identify resource-intensive processes.

### 3. Intelligent Alert Engine
- Configurable CPU usage thresholds.
- Configurable memory thresholds.
- Disk utilization warnings.
- WARNING and CRITICAL severity levels.
- Alert history and acknowledgement.

### 4. Interactive Dashboard
- Live CPU, RAM, disk, and network cards.
- Dynamic resource utilization charts.
- System health indicators.
- Process monitoring table.
- Recent alerts and notifications.
- Historical performance analytics.

### 5. Backend & Authentication
- Supabase Authentication.
- PostgreSQL database.
- Supabase Realtime subscriptions.
- Row Level Security (RLS).
- Secure storage of system metrics and alerts.

### 6. Advanced Features
- Resource utilization trend analysis.
- Anomaly detection as an optional ML enhancement.
- Performance bottleneck identification.
- Automated recovery recommendations.

## 🛠️ Technology Stack

| Layer | Technology |
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

## 🏗️ System Architecture

```text
              UBUNTU LINUX
                   |
                   v
          PYTHON MONITORING AGENT
                   |
          +--------+--------+
          |        |        |
          v        v        v
         CPU      RAM     DISK
          |        |        |
          +--------+--------+
                   |
                   v
             NETWORK &
              PROCESSES
                   |
                   v
          METRICS COLLECTION
                   |
                   v
           ALERT THRESHOLD
               ENGINE
                   |
             +-----+-----+
             |           |
             v           v
          SUPABASE    ALERTS
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
    ANALYTICS     ALERT UI
       |
       v
  PERFORMANCE HISTORY
```

## 📂 Project Structure

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

## ⚙️ Installation & Setup

### Prerequisites

- Ubuntu Linux 22.04 or later.
- Python 3.10 or later.
- Node.js 20 or later.
- npm.
- Git.
- Supabase account.

### 1. Clone Repository

```bash
git clone https://github.com/abhiraj-ops/OS-Resource-Monitoring-Alert-System.git

cd OS-Resource-Monitoring-Alert-System
```

### 2. Install System Dependencies

```bash
sudo apt update

sudo apt install python3 python3-pip python3-venv git -y
```

### 3. Setup Monitoring Agent

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

Create `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Start development server:

```bash
npm run dev
```

### 5. Supabase Configuration

1. Create a Supabase project.
2. Create the PostgreSQL database tables using `supabase/schema.sql`.
3. Configure Supabase Authentication.
4. Enable Row Level Security.
5. Configure Realtime for the required tables.
6. Configure environment variables securely for the monitoring agent.

**Security:** Never expose the Supabase service-role key in frontend code or commit secret credentials to GitHub.

## 📊 System Metrics

| Metric | Description |
|---|---|
| CPU | Overall and core-wise utilization |
| Memory | Used, free, and available RAM |
| Swap | Swap memory utilization |
| Disk | Partition storage usage |
| Network | Upload and download throughput |
| Processes | PID, CPU, and memory consumption |
| Uptime | System running duration |
| Load Average | System workload over time |

## 🚨 Alert Classification

| Level | Description |
|---|---|
| INFO | General system information |
| WARNING | Resource utilization approaching threshold |
| CRITICAL | Resource utilization exceeding critical threshold |

## 👥 Team Contributions

Developed collaboratively by three team members.

| Member | Responsibility |
|---|---|
| Member 1 | React Frontend & Dashboard |
| Member 2 | Python Monitoring Agent & Linux Integration |
| Member 3 | Supabase Backend & Database |

All team members contribute to testing, integration, documentation, and final deployment.

## 🎓 Operating System Concepts

This project demonstrates practical applications of:

- Process Management
- CPU Utilization
- Memory Management
- Disk Management
- Resource Monitoring
- System Performance Analysis
- Process Scheduling Concepts
- Resource Allocation

## 🚀 Future Enhancements

- Machine learning-based anomaly detection.
- Predictive resource utilization.
- Multi-machine monitoring.
- Email notifications.
- Automated process management with user approval.
- Advanced performance reporting.

## 📜 License

This project is licensed under the MIT License.

---

<p align="center">
  <b>Built with Python, React, Ubuntu Linux & Supabase.</b>
</p>
