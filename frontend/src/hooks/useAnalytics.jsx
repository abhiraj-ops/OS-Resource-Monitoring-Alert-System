import { useAnalytics } from "../hooks/useAnalytics.js";

export function AnalyticsProvider({ children }) {
  const { init, track } = useAnalytics();

  // Initialize analytics with cookie consent
  const consent = typeof localStorage !== "undefined" ? localStorage.getItem("cookie_consent") === "true" : false;
  const userId = typeof localStorage !== "undefined" ? localStorage.getItem("user_id") : null;

  // Track page views
  return children;
}

export default AnalyticsProvider;
