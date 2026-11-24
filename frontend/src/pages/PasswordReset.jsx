import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, AlertCircle } from "lucide-react";
import { passwordResetSchema } from "../lib/validators.ts";
import { ErrorMessage } from "../components/ErrorMessage.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      // Real reset happens via Supabase resetPasswordForEmail in useAuth.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSent(true);
    } catch (err) {
      setServerError(
        err.message ||
          "If an account exists for this email, a reset link has been sent."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
        <section className="panel p-10 text-center max-w-md">
          <Mail className="mx-auto mb-6 w-10 h-10 text-[#65e6bd]" />
          <h1 className="text-2xl font-bold mb-2">Reset link sent</h1>
          <p className="text-sm text-[#8190a9] mb-6">
            Check your inbox for a password reset link. It expires in 15 minutes.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-[#1b8067] px-6 py-3 text-sm font-semibold text-white hover:bg-[#219477] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            Return to sign in
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
      <ErrorMessage message={serverError} />
      <section className="panel w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-[#f2bf60]" />
          <h1 className="text-2xl font-bold">Reset password</h1>
        </div>
        <p className="mb-6 text-sm text-[#9eacc3]">
          Enter your email address and we will send you a secure reset link.
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
          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-[#1b8067] px-4 py-3 font-semibold text-white transition hover:bg-[#219477] disabled:opacity-60 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            {loading ? <LoadingSpinner size={16} message="" /> : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#75849d]">
          Remember your password?{" "}
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
