"""Process collector - gathers running process metrics."""
import psutil


def collect(limit=50):
    """Return top processes by CPU/memory as a list of dicts."""
    processes = []

    for proc in psutil.process_iter(["pid", "name", "username", "cpu_percent", "memory_info"]):
        try:
            info = proc.info
            processes.append({
                "pid": info["pid"],
                "process_name": info["name"] or "unknown",
                "username": info["username"],
                "cpu_percent": round(info["cpu_percent"] or 0.0, 2),
                "memory_bytes": info["memory_info"].rss if info["memory_info"] else 0,
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    # Sort by CPU percent descending, limit results
    processes.sort(key=lambda p: p["cpu_percent"], reverse=True)
    return processes[:limit]


if __name__ == "__main__":
    import json
    print(json.dumps(collect(), indent=2))
