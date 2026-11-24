import { useAuth } from "../hooks/useAuth.jsx";
import { AnalyticsProvider } from "../hooks/useAnalytics.jsx";
import { ErrorTrackingProvider } from "../hooks/useErrorTracking.jsx";

export function AuthProvider({ children }) {
  return children;
}

export function AnalyticsProvider({ children }) {
  return children;
}

export function ErrorTrackingProvider({ children }) {
  return children;
}

export default AuthProvider;
