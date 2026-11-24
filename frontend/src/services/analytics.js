// Analytics — privacy-friendly, opt-in where required.
// Only non-personal, aggregated events are logged.
// No third-party tracking pixels or advertising IDs.

let enabled = false;
let userId = null;

export function initAnalytics(consentGiven, uid = null) {
  enabled = Boolean(consentGiven);
  userId = uid || null;
}

export function track(eventName, properties = {}) {
  if (!enabled) return;
  const payload = {
    event: eventName,
    properties: { ...properties, timestamp: new Date().toISOString() },
    // userId is intentionally not persisted client-side; server-side mapping handles it.
  };

  // In production, send to your own analytics endpoint, not a third-party tracker.
  // Example:
  // await fetch("/api/analytics", { method: "POST", body: JSON.stringify(payload) });
  console.debug("[analytics]", payload);
}

export function isAnalyticsEnabled() {
  return enabled;
}

export default { initAnalytics, track, isAnalyticsEnabled };
