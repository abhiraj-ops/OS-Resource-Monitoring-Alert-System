"""Alert threshold engine - evaluates metrics against thresholds."""
from config.settings import (
    CPU_WARNING_THRESHOLD, CPU_CRITICAL_THRESHOLD,
    MEMORY_WARNING_THRESHOLD, MEMORY_CRITICAL_THRESHOLD,
    DISK_WARNING_THRESHOLD, DISK_CRITICAL_THRESHOLD,
)


def evaluate(metrics):
    """Evaluate metrics and return a list of alerts."""
    alerts = []

    cpu = metrics.get("cpu_percent")
    if cpu is not None:
        if cpu >= CPU_CRITICAL_THRESHOLD:
            alerts.append({
                "alert_type": "high_cpu_usage",
                "severity": "critical",
                "message": f"CPU usage at {cpu}% (critical threshold: {CPU_CRITICAL_THRESHOLD}%)",
                "details": {"cpu_percent": cpu, "threshold": CPU_CRITICAL_THRESHOLD},
            })
        elif cpu >= CPU_WARNING_THRESHOLD:
            alerts.append({
                "alert_type": "high_cpu_usage",
                "severity": "warning",
                "message": f"CPU usage at {cpu}% (warning threshold: {CPU_WARNING_THRESHOLD}%)",
                "details": {"cpu_percent": cpu, "threshold": CPU_WARNING_THRESHOLD},
            })

    memory = metrics.get("memory_percent")
    if memory is not None:
        if memory >= MEMORY_CRITICAL_THRESHOLD:
            alerts.append({
                "alert_type": "high_memory_usage",
                "severity": "critical",
                "message": f"Memory usage at {memory}% (critical threshold: {MEMORY_CRITICAL_THRESHOLD}%)",
                "details": {"memory_percent": memory, "threshold": MEMORY_CRITICAL_THRESHOLD},
            })
        elif memory >= MEMORY_WARNING_THRESHOLD:
            alerts.append({
                "alert_type": "high_memory_usage",
                "severity": "warning",
                "message": f"Memory usage at {memory}% (warning threshold: {MEMORY_WARNING_THRESHOLD}%)",
                "details": {"memory_percent": memory, "threshold": MEMORY_WARNING_THRESHOLD},
            })

    disk = metrics.get("disk_percent")
    if disk is not None:
        if disk >= DISK_CRITICAL_THRESHOLD:
            alerts.append({
                "alert_type": "high_disk_usage",
                "severity": "critical",
                "message": f"Disk usage at {disk}% (critical threshold: {DISK_CRITICAL_THRESHOLD}%)",
                "details": {"disk_percent": disk, "threshold": DISK_CRITICAL_THRESHOLD},
            })
        elif disk >= DISK_WARNING_THRESHOLD:
            alerts.append({
                "alert_type": "high_disk_usage",
                "severity": "warning",
                "message": f"Disk usage at {disk}% (warning threshold: {DISK_WARNING_THRESHOLD}%)",
                "details": {"disk_percent": disk, "threshold": DISK_WARNING_THRESHOLD},
            })

    return alerts


if __name__ == "__main__":
    import json
    test_metrics = {
        "cpu_percent": 95.0,
        "memory_percent": 85.0,
        "disk_percent": 92.0,
    }
    print(json.dumps(evaluate(test_metrics), indent=2))
