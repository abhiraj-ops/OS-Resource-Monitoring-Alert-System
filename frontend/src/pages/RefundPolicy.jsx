import { FileText, RefreshCw } from "lucide-react";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-[#090e19] px-4 text-[#edf2fb]">
      <section className="max-w-3xl mx-auto py-10 px-6">
        <nav className="mb-6">
          <a
            href="/"
            className="text-xs text-[#65e6bd] underline underline-offset-4 hover:text-[#7ee4c4]"
          >
            ← Back to home
          </a>
        </nav>
        <article className="panel p-8 max-[720px]:p-6">
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw className="w-5 h-5 text-[#65e6bd]" />
            <h1 className="text-2xl font-bold">Refund Policy</h1>
          </div>
          <p className="text-xs text-[#8190a9] mb-6 uppercase tracking-wider">
            Effective: November 24, 2026
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">1. Free service</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            OS Resource Monitoring is provided as a free monitoring platform.
            There are no paid plans, subscriptions, or purchases, so no refunds
            are applicable.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">2. No hidden fees</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            There are no hidden fees, automatic charges, or unexpected costs.
            All features described are available without payment.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">3. Data deletion</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            You may delete your account and all associated data at any time via
            the "Delete my data" option in settings. Deletion is permanent and
            cannot be reversed.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">4. Contact</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            For questions, contact{" "}
            <a href="mailto:support@os-resource-monitoring.example.com" className="text-[#65e6bd] underline underline-offset-4">
              support@os-resource-monitoring.example.com
            </a>
            .
          </p>

          <RefreshCw className="mt-8 w-4 h-4 text-[#4b5a6e]" />
        </article>
      </section>
    </main>
  );
}
