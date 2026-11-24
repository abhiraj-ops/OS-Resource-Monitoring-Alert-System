"""CPU collector - gathers CPU utilization metrics."""
import psutil


def collect():
    """Return CPU metrics as a dict."""
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count(logical=True)
    cpu_freq = psutil.cpu_freq()
    load_avg = psutil.getloadavg()

    return {
        "cpu_percent": round(cpu_percent, 2),
        "cpu_count": cpu_count,
        "cpu_freq_mhz": round(cpu_freq.current, 2) if cpu_freq else None,
        "load_avg_1m": round(load_avg[0], 2),
        "load_avg_5m": round(load_avg[1], 2),
        "load_avg_15m": round(load_avg[2], 2),
    }


if __name__ == "__main__":
    import json
    print(json.dumps(collect(), indent=2))
