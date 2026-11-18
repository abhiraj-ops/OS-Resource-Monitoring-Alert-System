import { useEffect, useState } from "react";

const emptyData = { metrics: [], alerts: [], processes: [] };

export default function useDashboardData(supabase, userId) {
  const [systems, setSystems] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [snapshot, setSnapshot] = useState(emptyData);
  const [loadingSystems, setLoadingSystems] = useState(true);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [error, setError] = useState("");
  const [realtimeStatus, setRealtimeStatus] = useState("connecting");

  useEffect(() => {
    if (!supabase || !userId) return undefined;
    let active = true;

    async function loadSystems() {
      setLoadingSystems(true);
      const { data, error: queryError } = await supabase
        .from("systems")
        .select("id, hostname, display_name, operating_system, status, last_seen_at")
        .order("last_seen_at", { ascending: false, nullsFirst: false });

      if (!active) return;
      if (queryError) {
        setError(queryError.message);
      } else {
        setError("");
        setSystems(data ?? []);
        if (!data?.length) {
          setSnapshot(emptyData);
          setRealtimeStatus("waiting");
        }
        setSelectedSystemId(current =>
          data?.some(system => system.id === current) ? current : data?.[0]?.id ?? "",
        );
      }
      setLoadingSystems(false);
    }

    loadSystems();
    const channel = supabase
      .channel(`systems-${userId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "systems",
        filter: `user_id=eq.${userId}`,
      }, loadSystems)
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  useEffect(() => {
    if (!supabase || !selectedSystemId) return undefined;

    let active = true;
    let refreshQueued = false;

    async function refreshSnapshot() {
      if (refreshQueued) return;
      refreshQueued = true;
      setLoadingSnapshot(true);
      const [metricsResult, alertsResult, processesResult] = await Promise.all([
        supabase.from("metrics")
          .select("id, cpu_percent, memory_used_bytes, memory_total_bytes, disk_used_bytes, disk_total_bytes, network_received_bytes, network_sent_bytes, collected_at")
          .eq("system_id", selectedSystemId)
          .order("collected_at", { ascending: false })
          .limit(30),
        supabase.from("alerts")
          .select("id, alert_type, severity, message, status, triggered_at")
          .eq("system_id", selectedSystemId)
          .order("triggered_at", { ascending: false })
          .limit(8),
        supabase.from("processes")
          .select("id, pid, process_name, cpu_percent, memory_bytes, username, captured_at")
          .eq("system_id", selectedSystemId)
          .order("captured_at", { ascending: false })
          .limit(100),
      ]);

      if (!active) return;
      const failedResult = [metricsResult, alertsResult, processesResult].find(result => result.error);
      if (failedResult) {
        setError(failedResult.error.message);
      } else {
        setError("");
        setSnapshot({
          metrics: metricsResult.data ?? [],
          alerts: alertsResult.data ?? [],
          processes: processesResult.data ?? [],
        });
      }
      setLoadingSnapshot(false);
      refreshQueued = false;
    }

    refreshSnapshot();
    const channel = supabase
      .channel(`system-dashboard-${selectedSystemId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "metrics", filter: `system_id=eq.${selectedSystemId}` }, refreshSnapshot)
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts", filter: `system_id=eq.${selectedSystemId}` }, refreshSnapshot)
      .on("postgres_changes", { event: "*", schema: "public", table: "processes", filter: `system_id=eq.${selectedSystemId}` }, refreshSnapshot)
      .subscribe(status => {
        if (!active) return;
        if (status === "SUBSCRIBED") setRealtimeStatus("live");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setRealtimeStatus("offline");
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabase, selectedSystemId]);

  return {
    systems,
    selectedSystemId,
    setSelectedSystemId,
    ...snapshot,
    loading: loadingSystems || loadingSnapshot,
    error,
    realtimeStatus,
  };
}
