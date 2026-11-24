import { useState, useCallback } from "react";
import { captureError } from "../services/errorTracking.js";
import { track } from "../services/analytics.js";

export function useDashboardData(supabase, userId) {
  const [systems, setSystems] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [snapshot, setSnapshot] = useState({
    metrics: [],
    alerts: [],
    processes: [],
  });
  const [loadingSystems, setLoadingSystems] = useState(true);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [error, setError] = useState("");
  const [realtimeStatus, setRealtimeStatus] = useState("connecting");

  const loadSystems = useCallback(async () => {
    if (!supabase || !userId) return;
    setLoadingSystems(true);
    try {
      const { data, error: queryError } = await supabase
        .from("systems")
        .select(
          "id, hostname, display_name, operating_system, status, last_seen_at"
        )
        .eq("user_id", userId)
        .order("last_seen_at", { ascending: false, nullsFirst: false });

      if (queryError) throw queryError;
      setError("");
      setSystems(data ?? []);
      if (!data?.length) {
        setSnapshot({ metrics: [], alerts: [], processes: [] });
        setRealtimeStatus("waiting");
      }
      setSelectedSystemId((current) =>
        data?.some((system) => system.id === current)
          ? current
          : data?.[0]?.id ?? ""
      );
    } catch (err) {
      captureError(err, { context: "dashboard:loadSystems" });
      setError(err.message || "Unable to load systems.");
    } finally {
      setLoadingSystems(false);
    }
  }, [supabase, userId]);

  const refreshSnapshot = useCallback(async () => {
    if (!supabase || !selectedSystemId) return;
    setLoadingSnapshot(true);
    try {
      const [metricsResult, alertsResult, processesResult] =
        await Promise.all([
          supabase
            .from("metrics")
            .select(
              "id, cpu_percent, memory_used_bytes, memory_total_bytes, disk_used_bytes, disk_total_bytes, network_received_bytes, network_sent_bytes, collected_at"
            )
            .eq("system_id", selectedSystemId)
            .order("collected_at", { ascending: false })
            .limit(30),
          supabase
            .from("alerts")
            .select(
              "id, alert_type, severity, message, status, triggered_at"
            )
            .eq("system_id", selectedSystemId)
            .order("triggered_at", { ascending: false })
            .limit(8),
          supabase
            .from("processes")
            .select(
              "id, pid, process_name, cpu_percent, memory_bytes, username, captured_at"
            )
            .eq("system_id", selectedSystemId)
            .order("captured_at", { ascending: false })
            .limit(100),
        ]);

      const failed = [metricsResult, alertsResult, processesResult].find(
        (r) => r.error
      );
      if (failed) throw failed.error;

      setError("");
      setSnapshot({
        metrics: metricsResult.data ?? [],
        alerts: alertsResult.data ?? [],
        processes: processesResult.data ?? [],
      });
      track("dashboard_data_refreshed", { systemId: selectedSystemId });
    } catch (err) {
      captureError(err, { context: "dashboard:refreshSnapshot" });
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoadingSnapshot(false);
    }
  }, [supabase, selectedSystemId]);

  return {
    systems,
    selectedSystemId,
    setSelectedSystemId,
    ...snapshot,
    loading: loadingSystems || loadingSnapshot,
    error,
    realtimeStatus,
    loadSystems,
    refreshSnapshot,
  };
}

export default useDashboardData;
