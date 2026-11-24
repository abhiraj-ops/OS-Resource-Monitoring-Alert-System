"""Disk collector - gathers disk storage metrics."""
import psutil


def collect():
    """Return disk metrics as a dict."""
    partitions = psutil.disk_partitions()
    disk_info = []

    for part in partitions:
        try:
            usage = psutil.disk_usage(part.mountpoint)
            disk_info.append({
                "device": part.device,
                "mountpoint": part.mountpoint,
                "fstype": part.fstype,
                "total_bytes": usage.total,
                "used_bytes": usage.used,
                "free_bytes": usage.free,
                "percent": round(usage.percent, 2),
            })
        except PermissionError:
            continue

    # Aggregate: use the root/system partition as primary
    primary = disk_info[0] if disk_info else {}

    return {
        "disk_partitions": disk_info,
        "disk_used_bytes": primary.get("used_bytes"),
        "disk_total_bytes": primary.get("total_bytes"),
        "disk_percent": primary.get("percent"),
    }


if __name__ == "__main__":
    import json
    print(json.dumps(collect(), indent=2))
