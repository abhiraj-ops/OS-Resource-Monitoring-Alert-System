"""Supabase client for sending metrics and alerts."""
import os
from supabase import create_client, Client


class SupabaseClient:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
        self.client: Client = create_client(url, key)

    def register_system(self, hostname, display_name, operating_system, os_version, agent_version, user_id):
        """Register a monitored system and return its system_id."""
        result = self.client.table("systems").insert({
            "user_id": user_id,
            "hostname": hostname,
            "display_name": display_name,
            "operating_system": operating_system,
            "os_version": os_version,
            "agent_version": agent_version,
            "status": "online",
        }).execute()
        return result.data[0]["id"]

    def insert_metrics(self, system_id, metrics):
        """Insert a metrics snapshot."""
        self.client.table("metrics").insert({
            "system_id": system_id,
            **metrics,
        }).execute()

    def insert_alerts(self, system_id, alerts):
        """Insert alert records."""
        for alert in alerts:
            self.client.table("alerts").insert({
                "system_id": system_id,
                **alert,
            }).execute()

    def insert_processes(self, system_id, processes):
        """Insert process snapshots."""
        for proc in processes:
            self.client.table("processes").insert({
                "system_id": system_id,
                **proc,
            }).execute()

    def update_system_status(self, system_id, status):
        """Update system status and last_seen_at."""
        self.client.table("systems").update({
            "status": status,
        }).eq("id", system_id).execute()


if __name__ == "__main__":
    print("SupabaseClient ready. Import and use with valid credentials.")
