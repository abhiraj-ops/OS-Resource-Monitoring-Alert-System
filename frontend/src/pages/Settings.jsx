import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { DataDeletionRequest } from "../components/DataDeletionRequest.jsx";
import { BusinessDetails } from "../components/BusinessDetails.jsx";
import { AgeConsent } from "../components/AgeConsent.jsx";
import { ShieldCheck, User, Trash2, Mail, Lock, AlertCircle, ArrowRight, Bell, Palette, LogOut } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";

export default function Settings({ supabase, openDelete = false }) {
  const navigate = useNavigate();
  const { user, session, signOut, deleteAccount, loading, error, setError } = useAuth();
  const { theme, setTheme, themes, themeInfo } = useTheme();
  const [showDeletion, setShowDeletion] = useState(openDelete);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSignOut = async () => {
    setError(null);
    await signOut();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#0a0f1d] px-4 py-8 text-[#edf2fb]">
      <section className="max-w-2xl mx-auto">
        <nav className="mb-6 flex items-center gap-2">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
          >
            <ArrowRight className="w-4 h-4" style={{ transform: "rotate(180deg)" }} />
            Back to dashboard
          </a>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {!ageConfirmed && (
          <AgeConsent onConfirm={setAgeConfirmed} />
        )}

        {/* Account */}
        <section className="panel p-6 mb-6 rounded-xl border" style={ { borderColor: "var(--border)", background: "var(--panel)" } }>
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border" style={ { borderColor: "var(--border)", background: "var(--panel-inner)" } }>
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
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? "Signing out…" : "Sign out"}
              </button>
            </div>

            {session && (
              <div className="flex items-center justify-between p-4 rounded-lg border" style={ { borderColor: "var(--border)", background: "var(--panel-inner)" } }>
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

        {/* Appearance */}
        <section className="panel p-6 mb-6 rounded-xl border" style={ { borderColor: "var(--border)", background: "var(--panel)" } }>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Appearance</h2>
            <Palette className="w-5 h-5 text-[#65e6bd]" />
          </div>
          <p className="text-xs text-[#8190a9] mb-4">Choose your preferred theme. Changes apply immediately.</p>
          <div className="grid gap-2 md:grid-cols-4">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition ${
                  theme === t
                    ? "bg-[#10b981]/10 border-[#10b981]/40"
                    : "border-[#30405b] hover:border-[#65e6bd] hover:bg-[#182337]"
                }`}
              >
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={ { background: `linear-gradient(135deg, ${["#0a0f1d", "#060b16", "#eef4fb", "#050607"][themes.indexOf(t)]} 0%, ${["#0284c7", "#10b981", "#0369a1", "#525252"][themes.indexOf(t)]} 55%, ${["#38bdf8", "#8b5cf6", "#93c5fd", "#fafafa"][themes.indexOf(t)]} 100%)`, borderColor: "var(--border-strong)" } } />
                <span className="text-xs font-semibold" style={ { color: "var(--text)" } }>{themeInfo[t].label}</span>
                <span className="text-[10px]" style={ { color: "var(--text-subtle)" } }>{themeInfo[t].hint}</span>
                {theme === t && <Check className="h-3 w-3 text-[#10b981]" />}
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="panel p-6 mb-6 rounded-xl border" style={ { borderColor: "var(--border)", background: "var(--panel)" } }>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Notifications</h2>
            <Bell className="w-5 h-5 text-[#65e6bd]" />
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border cursor-pointer" style={ { borderColor: "var(--border)", background: "var(--panel-inner)" } }>
              <span className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#65e6bd]" />
                <div>
                  <p className="font-semibold">Email notifications</p>
                  <p className="text-xs text-[#8190a9]">Receive alert emails for critical events</p>
                </div>
              </span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded border-[#30405b] bg-[#0c1422] text-[#10b981] focus:ring-[#10b981]"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border cursor-pointer" style={ { borderColor: "var(--border)", background: "var(--panel-inner)" } }>
              <span className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#65e6bd]" />
                <div>
                  <p className="font-semibold">Push notifications</p>
                  <p className="text-xs text-[#8190a9]">Browser push notifications for alerts</p>
                </div>
              </span>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="rounded border-[#30405b] bg-[#0c1422] text-[#10b981] focus:ring-[#10b981]"
              />
            </label>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="panel p-6 mb-6 rounded-xl border" style={ { borderColor: "var(--border)", background: "var(--panel)" } }>
          <h2 className="text-lg font-bold mb-4">Data &amp; Privacy</h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowDeletion(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-[#7a1f1f] bg-[#1a0f0f] hover:bg-[#221212] focus:outline-none focus:ring-2 focus-ring focus:ring-[#f2bf60] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-[#f2bf60]" />
                <div>
                  <p className="font-semibold text-red-200">Delete my account &amp; data</p>
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

function Check({ className }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
