import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, UserPlus, AlertCircle } from "lucide-react";
import { signupSchema } from "../lib/validators.ts";
import { ErrorMessage } from "../components/ErrorMessage.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      // Real signup happens via Supabase auth in App/useAuth.
      // This page collects and validates input, including age + consent.
      await new Promise((resolve) => setTimeout(resolve, 800));
      navigate("/verify-email");
    } catch (err) {
      setServerError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
      <ErrorMessage message={serverError} />
      <section className="panel w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-5 h-5 text-[#65e6bd]" />
          <h1 className="text-2xl font-bold">Create account</h1>
        </div>
        <p className="mb-6 text-sm text-[#9eacc3]">
          Join us to monitor your Linux systems in real time.
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
              autoComplete="new-password"
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
          <label className="grid gap-1.5 text-sm text-[#b8c4d8]">
            Confirm password
            <Lock className="absolute right-3 top-9 w-4 h-4 text-[#4b5a6e]" />
            <input
              {...register("confirmPassword")}
              autoComplete="new-password"
              className="rounded-lg border border-[#30405b] bg-[#0c1422] px-3 py-2.5 text-white pl-10 outline-none focus:border-[#65e6bd]"
              type="password"
              aria-required="true"
              aria-invalid={!!errors.confirmPassword}
              aria-describedBy={errors.confirmPassword ? "confirm-error" : undefined}
            />
            {errors.confirmPassword && (
              <p id="confirm-error" className="text-xs text-[#fca5a5]">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>
          <div className="flex items-start gap-2 pt-1">
            <input
              {...register("ageConsent")}
              type="checkbox"
              className="rounded border-[#30405b] bg-[#0c1422] text-[#65e6bd] focus:ring-[#65e6bd] focus:ring-offset-[#090e19]"
              aria-required="true"
            />
            <label className="text-sm text-[#c1ccdc] leading-snug">
              I confirm I am at least 13 years old
            </label>
          </div>
          {errors.ageConsent && (
            <p className="text-xs text-[#fca5a5]">{errors.ageConsent.message}</p>
          )}
          <div className="flex items-start gap-2 pt-1">
            <input
              {...register("termsConsent")}
              type="checkbox"
              className="rounded border-[#30405b] bg-[#0c1422] text-[#65e6bd] focus:ring-[#65e6bd] focus:ring-offset-[#090e19]"
              aria-required="true"
            />
            <label className="text-sm text-[#c1ccdc] leading-snug">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
              >
                Terms of Service
              </a>
              {" "}
              and{" "}
              <a
                href="/privacy"
                className="text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.termsConsent && (
            <p className="text-xs text-[#fca5a5]">{errors.termsConsent.message}</p>
          )}
          <div className="flex items-start gap-2 pt-1">
            <input
              {...register("privacyConsent")}
              type="checkbox"
              className="rounded border-[#30405b] bg-[#0c1422] text-[#65e6bd] focus:ring-[#65e6bd] focus:ring-offset-[#090e19]"
              aria-required="true"
            />
            <label className="text-sm text-[#c1ccdc] leading-snug">
              I agree to the Privacy Policy
            </label>
          </div>
          {errors.privacyConsent && (
            <p className="text-xs text-[#fca5a5]">{errors.privacyConsent.message}</p>
          )}
          <div className="flex items-start gap-2 pt-1">
            <input
              {...register("marketingConsent")}
              type="checkbox"
              className="rounded border-[#30405b] bg-[#0c1422] text-[#65e6bd] focus:ring-[#65e6bd] focus:ring-offset-[#090e19]"
            />
            <label className="text-sm text-[#c1ccdc] leading-snug">
              I would like to receive product updates and security notices by email.
              You can unsubscribe at any time.
            </label>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-[#1b8067] px-4 py-3 font-semibold text-white transition hover:bg-[#219477] disabled:opacity-60 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            {loading ? <LoadingSpinner size={16} message="" /> : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#75849d]">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
          >
            Sign in
          </a>
        </p>
      </section>
    </main>
  );
}
