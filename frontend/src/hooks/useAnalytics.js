import { useState, useEffect, useCallback } from "react";
import { track } from "../services/analytics.js";

export function useAnalytics() {
  const [initialized, setInitialized] = useState(false);

  const init = useCallback((consentGiven, userId) => {
    track("analytics_init", { consentGiven });
    setInitialized(true);
  }, []);

  const trackEvent = useCallback((eventName, properties = {}) => {
    if (!initialized) return;
    track(eventName, properties);
  }, [initialized]);

  useEffect(() => {
    return () => {
      // cleanup if needed
    };
  }, []);

  return { initialized, init, track: trackEvent };
}

export default useAnalytics;
