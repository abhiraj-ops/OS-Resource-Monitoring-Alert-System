import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(null);
  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // In production, read the email confirmation token from the URL query
    // and confirm via Supabase auth.verifyOtp. For now, simulate.
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, []);

  const resend = async () => {
    setResendLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setError("A new verification link has been sent to your email.");
    } catch (err) {
      setError("Unable to resend verification email. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
      <section className="panel w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          {verified ? (
            <CheckCircle className="w-5 h-5 text-[#65e6bd]" />
          ) : (
            <Mail className="w-5 h-5 text-[#65e6bd]" />
          )}
          <h1 className="text-2xl font-bold">
            {verified ? "Email verified" : "Verify your email"}
          </h1>
        </div>
        {verified ? (
          <>
            <p className="text-sm text-[#8190a9] mb-6">
              Your email address has been confirmed. You can now sign in.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-[#1b8067] px-6 py-3 text-sm font-semibold text-white hover:bg-[#219477] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-[#8190a9] mb-6">
              A verification link has been sent to your inbox. Please open it to
              activate your account.
            </p>
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-900 bg-red-950/10 p-3 text-sm text-red-200"
              >
                {error}
              </div>
            )}
            <div className="grid gap-3">
              <button
                onClick={resend}
                disabled={resendLoading}
                className="rounded-lg border border-[#30405b] px-4 py-3 text-sm text-[#c1ccdc] hover:bg-[#182337] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
              >
                {resendLoading ? "Sending…" : "Resend verification email"}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg bg-transparent px-4 py-3 text-sm text-[#8190a9] hover:text-white focus:outline-none"
              >
                Already verified? Sign in
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
