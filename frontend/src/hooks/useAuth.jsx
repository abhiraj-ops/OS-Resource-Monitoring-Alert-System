import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { captureError } from "../services/errorTracking.js";
import { track } from "../services/analytics.js";

// Local (non-Supabase) auth state persisted in localStorage.
// This lets the site run fully without any Supabase configuration.

const STORAGE_KEY = "osm_auth";
const DEMO_USER = {
  id: "demo-user-001",
  email: "admin@os-resource-monitoring.example.com",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setSession(parsed.session);
      } catch {}
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const payload = { user: DEMO_USER, session: { user: DEMO_USER, email } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setUser(DEMO_USER);
      setSession(payload.session);
      track("login_success", { email });
      return { data: { user: DEMO_USER }, error: null };
    } catch (err) {
      captureError(err, { context: "auth:signIn" });
      setError("Unable to sign in. Please try again.");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const payload = { user: DEMO_USER, session: { user: DEMO_USER, email } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setUser(DEMO_USER);
      setSession(payload.session);
      track("signup_initiated", { email });
      return { data: { user: DEMO_USER }, error: null };
    } catch (err) {
      captureError(err, { context: "auth:signUp" });
      setError("Unable to create account. Please try again.");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setSession(null);
      track("logout", {});
    } catch (err) {
      captureError(err, { context: "auth:signOut" });
      setError("Unable to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      track("password_reset_requested", { email });
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:resetPassword" });
      setError("Unable to send reset email.");
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      track("password_updated", {});
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:updatePassword" });
      setError("Unable to update password.");
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("osm_systems");
      localStorage.removeItem("osm_metrics");
      localStorage.removeItem("osm_alerts");
      localStorage.removeItem("osm_processes");
      setUser(null);
      setSession(null);
      track("account_deleted", {});
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:deleteAccount" });
      setError("Unable to delete account.");
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      track("verification_resent", { email });
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:resendVerification" });
      setError("Unable to resend verification.");
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    error,
    setError,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    deleteAccount,
    resendVerification,
    isAuthenticated: Boolean(user),
    minimumAge: 13,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthProvider;
