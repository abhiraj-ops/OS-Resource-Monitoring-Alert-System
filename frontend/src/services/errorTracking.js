// Error tracking — client-side error boundary reporter.
// Sends errors to your own endpoint; no third-party SDKs.

let enabled = false;

export function initErrorTracking(consentGiven) {
  enabled = Boolean(consentGiven);
}

export function captureError(error, context = {}) {
  if (!enabled) return;
  const payload = {
    message: error?.message || String(error),
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : "",
  };
  console.error("[error tracking]", payload);
  // In production: await fetch("/api/errors", { method: "POST", body: JSON.stringify(payload) });
}

export function wrapAsync(fn, context = {}) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error, context);
      throw error;
    }
  };
}

export default { initErrorTracking, captureError, wrapAsync };
