"""Main monitoring agent entry point."""
import time
import socket
import platform
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from collectors.cpu import collect as collect_cpu
from collectors.memory import collect as collect_memory
from collectors.disk import collect as collect_disk
from collectors.network import collect as collect_network
from collectors.processes import collect as collect_processes
from alerts.threshold_engine import evaluate
from services.supabase_client import SupabaseClient
from config.settings import (
    COLLECTION_INTERVAL_SECONDS,
    AGENT_VERSION,
)


def get_hostname():
    return socket.gethostname()


def get_os_info():
    return {
        "operating_system": platform.system(),
        "os_version": platform.release(),
    }


def main():
    print(f"OS Resource Monitoring Agent v{AGENT_VERSION}")
    print("Starting monitoring...")

    hostname = get_hostname()
    os_info = get_os_info()

    try:
        supabase = SupabaseClient()
    except ValueError as e:
        print(f"Configuration error: {e}")
        print("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
        print("Running in demo mode (no data will be sent to Supabase).")
        supabase = None

    system_id = None
    user_id = os.getenv("SUPABASE_USER_ID")

    if supabase and user_id:
        system_id = supabase.register_system(
            hostname=hostname,
            display_name=hostname,
            operating_system=os_info["operating_system"],
            os_version=os_info["os_version"],
            agent_version=AGENT_VERSION,
            user_id=user_id,
        )
        print(f"Registered system: {hostname} (id: {system_id})")

    try:
        while True:
            # Collect metrics
            metrics = {}
            metrics.update(collect_cpu())
            metrics.update(collect_memory())
            metrics.update(collect_disk())
            metrics.update(collect_network())

            # Collect processes
            proc_list = collect_processes()

            # Evaluate alerts
            alerts = evaluate(metrics)

            if supabase and system_id:
                supabase.insert_metrics(system_id, metrics)
                if alerts:
                    supabase.insert_alerts(system_id, alerts)
                supabase.insert_processes(system_id, proc_list)
                supabase.update_system_status(system_id, "online")

            print(f"Collected metrics: CPU={metrics.get('cpu_percent')}% "
                  f"RAM={metrics.get('memory_percent')}% "
                  f"Disk={metrics.get('disk_percent')}% "
                  f"Alerts={len(alerts)}")

            time.sleep(COLLECTION_INTERVAL_SECONDS)

    except KeyboardInterrupt:
        print("\nStopping monitoring agent...")
        if supabase and system_id:
            supabase.update_system_status(system_id, "offline")
        print("Agent stopped.")


if __name__ == "__main__":
    main()
