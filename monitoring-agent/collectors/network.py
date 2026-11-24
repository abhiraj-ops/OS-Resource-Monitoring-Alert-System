"""Network collector - gathers network traffic metrics."""
import psutil


def collect():
    """Return network metrics as a dict."""
    net_io = psutil.net_io_counters()
    net_connections = len(psutil.net_connections())

    return {
        "network_sent_bytes": net_io.bytes_sent,
        "network_received_bytes": net_io.bytes_recv,
        "network_packets_sent": net_io.packets_sent,
        "network_packets_recv": net_io.packets_recv,
        "network_connections": net_connections,
    }


if __name__ == "__main__":
    import json
    print(json.dumps(collect(), indent=2))
