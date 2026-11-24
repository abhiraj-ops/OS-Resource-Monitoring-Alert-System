import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { supabase } from "../services/supabase.js";
import { captureError } from "../services/errorTracking.js";
import { track } from "../services/analytics.js";
import { SITE_CONFIG } from "../config/site.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error: err }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (err) captureError(err, { context: "auth:getSession" });
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setLoading(false);
        if (nextSession) {
          track("auth_sign_in", { provider: "email" });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) throw err;
      track("login_success", { email });
      return { data, error: null };
    } catch (err) {
      captureError(err, { context: "auth:signIn" });
      setError(err.message || "Unable to sign in. Please try again.");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      if (err) throw err;
      track("signup_initiated", { email });
      return { data, error: null };
    } catch (err) {
      captureError(err, { context: "auth:signUp" });
      setError(err.message || "Unable to create account. Please try again.");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signOut();
      if (err) throw err;
      setUser(null);
      setSession(null);
      track("logout", {});
    } catch (err) {
      captureError(err, { context: "auth:signOut" });
      setError(err.message || "Unable to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) throw err;
      track("password_reset_requested", { email });
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:resetPassword" });
      setError(
        err.message ||
          "If an account exists for this email, a reset link has been sent."
      );
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (err) throw err;
      track("password_updated", {});
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:updatePassword" });
      setError(err.message || "Unable to update password. Please try again.");
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.deleteUser();
      if (err) throw err;
      track("account_deleted", {});
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:deleteAccount" });
      setError(err.message || "Unable to delete account. Please contact support.");
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      if (err) throw err;
      track("verification_resent", { email });
      return { error: null };
    } catch (err) {
      captureError(err, { context: "auth:resendVerification" });
      setError(err.message || "Unable to resend verification email.");
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
    minimumAge: SITE_CONFIG.minimumAge,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthProvider;
