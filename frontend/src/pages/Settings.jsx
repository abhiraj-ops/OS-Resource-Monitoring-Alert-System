import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { DataDeletionRequest } from "../components/DataDeletionRequest.jsx";
import { BusinessDetails } from "../components/BusinessDetails.jsx";
import { AgeConsent } from "../components/AgeConsent.jsx";
import { ShieldCheck, User, Trash2, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function Settings({ supabase, openDelete = false }) {
  const navigate = useNavigate();
  const { user, session, signOut, deleteAccount, loading, error, setError } = useAuth();
  const [showDeletion, setShowDeletion] = useState(openDelete);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const handleSignOut = async () => {
    setError(null);
    await signOut();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#090e19] px-4 py-8 text-[#edf2fb]">
      <section className="max-w-2xl mx-auto">
        <nav className="mb-6 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-[#65e6bd]" />
          <a
            href="/dashboard"
            className="text-sm text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
          >
            Back to dashboard
          </a>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {!ageConfirmed && (
          <AgeConsent onConfirm={setAgeConfirmed} />
        )}

        <section className="panel p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#25334b] bg-[#0c1422]">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#65e6bd]" />
                <div>
                  <p className="font-semibold">{user?.email || "Signed in"}</p>
                  <p className="text-xs text-[#8190a9]">Account email</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="rounded-lg border border-[#30405b] px-3 py-2 text-sm text-[#c1ccdc] hover:bg-[#182337] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
              >
                {loading ? "Signing out…" : "Sign out"}
              </button>
            </div>

            {session && (
              <div className="flex items-center justify-between p-4 rounded-lg border border-[#25334b] bg-[#0c1422]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#65e6bd]" />
                  <div>
                    <p className="font-semibold">Row Level Security active</p>
                    <p className="text-xs text-[#8190a9]">Your data is isolated by user ownership</p>
                  </div>
                </div>
                <span className="text-xs text-[#65e6bd]">Protected</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Data &amp; privacy</h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowDeletion(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-[#7a1f1f] bg-[#1a0f0f] hover:bg-[#221212] focus:outline-none focus:ring-2 focus-ring focus:ring-[#f2bf60] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-[#f2bf60]" />
                <div>
                  <p className="font-semibold text-red-200">Delete my account & data</p>
                  <p className="text-xs text-[#fca5a5]">
                    Permanently erase your personal data under GDPR/CCPA
                  </p>
                </div>
              </div>
              <Mail className="w-4 h-4 text-[#fca5a5]" />
            </button>

            <button
              className="w-full flex items-center justify-between p-4 rounded-lg border border-[#30405b] bg-[#0c1422] hover:bg-[#182337] focus:outline-none focus:ring-2 focus:ring-[#65e6bd] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#65e6bd]" />
                <div>
                  <p className="font-semibold">Export my data</p>
                  <p className="text-xs text-[#8190a9]">Download a copy of your data</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4b5a6e]" />
            </button>
          </div>
        </section>

        {showDeletion && (
          <DataDeletionRequest onSubmit={() => setShowDeletion(false)} />
        )}

        <BusinessDetails />

        <p className="mt-8 text-xs text-[#77869e] text-center">
          Questions or privacy concerns?{" "}
          <a
            href="mailto:privacy@os-resource-monitoring.example.com"
            className="text-[#65e6bd] underline underline-offset-4"
          >
            privacy@os-resource-monitoring.example.com
          </a>
        </p>
      </section>
    </main>
  );
}

function ArrowLeft({ className }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
