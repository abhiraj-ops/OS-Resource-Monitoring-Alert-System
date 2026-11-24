import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginSchema } from "../lib/validators.ts";
import { ErrorMessage } from "../components/ErrorMessage.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      // Real login happens via Supabase auth in App/useAuth. This page
      // collects and validates input, then hands off to the auth provider.
      // Simulated server call here; replace with your backend endpoint.
      await new Promise((resolve) => setTimeout(resolve, 800));
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
      <ErrorMessage message={serverError} />
      <section className="panel w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <ShieldIcon className="w-5 h-5 text-[#65e6bd]" />
          <h1 className="text-2xl font-bold">Sign in</h1>
        </div>
        <p className="mb-6 text-sm text-[#9eacc3]">
          Enter your credentials to access your monitoring dashboard.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <label className="grid gap-1.5 text-sm text-[#b8c4d8]">
            Email address
            <Mail className="absolute right-3 top-9 w-4 h-4 text-[#4b5a6e]" />
            <input
              {...register("email")}
              autoComplete="email"
              className="rounded-lg border border-[#30405b] bg-[#0c1422] px-3 py-2.5 text-white pl-10 outline-none focus:border-[#65e6bd] type-email"
              type="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedBy={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-[#fca5a5]">
                {errors.email.message}
              </p>
            )}
          </label>
          <label className="grid gap-1.5 text-sm text-[#b8c4d8]">
            Password
            <Lock className="absolute right-3 top-9 w-4 h-4 text-[#4b5a6e]" />
            <input
              {...register("password")}
              autoComplete="current-password"
              className="rounded-lg border border-[#30405b] bg-[#0c1422] px-3 py-2.5 text-white pl-10 outline-none focus:border-[#65e6bd]"
              type="password"
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedBy={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-[#fca5a5]">
                {errors.password.message}
              </p>
            )}
          </label>
          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-[#1b8067] px-4 py-3 font-semibold text-white transition hover:bg-[#219477] disabled:opacity-60 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            {loading ? <LoadingSpinner size={16} message="" /> : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#75849d]">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
          >
            Create one
          </a>
          .{" "}
          <a
            href="/reset-password"
            className="text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
          >
            Forgot password?
          </a>
        </p>
      </section>
    </main>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
