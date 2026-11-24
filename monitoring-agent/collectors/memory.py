"""Memory collector - gathers RAM and swap metrics."""
import psutil


def collect():
    """Return memory metrics as a dict."""
    mem = psutil.virtual_memory()
    swap = psutil.swap_memory()

    return {
        "memory_used_bytes": mem.used,
        "memory_total_bytes": mem.total,
        "memory_available_bytes": mem.available,
        "memory_percent": round(mem.percent, 2),
        "swap_used_bytes": swap.used,
        "swap_total_bytes": swap.total,
        "swap_percent": round(swap.percent, 2),
    }


if __name__ == "__main__":
    import json
    print(json.dumps(collect(), indent=2))
