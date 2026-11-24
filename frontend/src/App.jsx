import { AuthProvider } from "./hooks/useAuth.jsx";
import { ErrorTrackingProvider } from "./hooks/useErrorTracking.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

export default function App() {
  return (
    <AuthProvider>
      <ErrorTrackingProvider>
        <ErrorBoundary />
      </ErrorTrackingProvider>
    </AuthProvider>
  );
}
