import { useState } from "react";
import { Trash2, Mail } from "lucide-react";

export function DataDeletionRequest({ onSubmit }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (submitted) {
    return (
      <section className="panel p-6 max-w-md mx-auto">
        <div className="flex items-start gap-3 mb-4">
          <Mail className="shrink-0 w-5 h-5 text-[#65e6bd]" />
          <div>
            <h3 className="text-lg font-bold text-[#edf2fb]">Request submitted</h3>
            <p className="text-sm text-[#8190a9] mt-1">
              We have received your data deletion request. A confirmation will be
              sent to {email}.
            </p>
          </div>
        </div>
        <p className="text-sm text-[#c1ccdc]">
          Under data protection law (GDPR/CCPA), you have the right to request
          deletion of your personal data. Your account and associated metrics,
          alerts, and processes will be erased within 30 days.
        </p>
      </section>
    );
  }

  return (
    <section
      className="panel p-6 max-w-md mx-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Delete my data"
    >
      <h3 className="text-lg font-bold text-[#edf2fb] mb-4">
        Delete my account & data
      </h3>
      <p className="text-sm text-[#c1ccdc] mb-6">
        This permanently removes your personal data, systems, metrics, alerts,
        and processes. This action cannot be undone.
      </p>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-900 bg-red-950/10 p-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          // In production, call your backend data-deletion endpoint here.
          setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
          }, 1200);
        }}
        className="space-y-3"
      >
        <label className="grid gap-1.5 text-sm text-[#b8c4d8]">
          Confirm email
          <input
            autoComplete="email"
            className="rounded-lg border border-[#30405b] bg-[#0c1422] px-3 py-2.5 text-white outline-none focus:border-[#65e6bd]"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          disabled={loading}
          type="submit"
          className="rounded-lg bg-[#7a1f1f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#9f2b2b] disabled:opacity-60 disabled:cursor-wait focus:outline-none focus:ring-2 focus-ring focus:ring-[#f2bf60]"
        >
          {loading ? "Submitting…" : "Request data deletion"}
        </button>
      </form>
      <p className="mt-4 text-xs text-[#77869e]">
        Questions? Contact{" "}
        <a href="mailto:privacy@os-resource-monitoring.example.com" className="text-[#65e6bd] underline underline-offset-4">
          privacy@os-resource-monitoring.example.com
        </a>
        .
      </p>
    </section>
  );
}

export default DataDeletionRequest;
