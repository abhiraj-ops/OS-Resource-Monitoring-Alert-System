import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { captureError } from "../services/errorTracking.js";

const ErrorTrackingContext = createContext(null);

export function ErrorTrackingProvider({ children }) {
  const [errors, setErrors] = useState([]);

  const capture = useCallback((error, context = {}) => {
    captureError(error, context);
    setErrors((prev) => [...prev.slice(-9), { error, context, time: Date.now() }]);
  }, []);

  useEffect(() => {
    const handleUnhandled = (event) => {
      capture(event.error || new Error(event.message), { context: "unhandled" });
    };
    const handleRejection = (event) => {
      capture(event.reason || new Error("Unhandled rejection"), { context: "rejection" });
    };
    window.addEventListener("error", handleUnhandled);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleUnhandled);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [capture]);

  return (
    <ErrorTrackingContext.Provider value={{ capture, errors }}>
      {children}
    </ErrorTrackingContext.Provider>
  );
}

export function useErrorTracking() {
  const context = useContext(ErrorTrackingContext);
  if (!context) throw new Error("useErrorTracking must be used within ErrorTrackingProvider");
  return context;
}

export default ErrorTrackingProvider;
