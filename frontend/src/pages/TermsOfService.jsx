import { FileText, FileCheck } from "lucide-react";

export default function TermsOfService() {
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
            <FileText className="w-5 h-5 text-[#65e6bd]" />
            <h1 className="text-2xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xs text-[#8190a9] mb-6 uppercase tracking-wider">
            Effective: November 24, 2026
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">1. Acceptance</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            By accessing or using OS Resource Monitoring, you agree to these
            terms. If you do not agree, do not use the service.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">2. Account eligibility</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            You must be at least 13 years old to create an account. You are
            responsible for keeping your account credentials secure.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">3. Use of the service</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            You may use the service to monitor systems you own or administer.
            You must not attempt to access other users' data or reverse-engineer
            the API.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">4. No hidden fees</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            The service is provided as described. There are no hidden fees or
            unexpected charges. Any future paid features will be clearly
            disclosed before activation.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">5. No fake reviews or unsupported claims</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            We do not publish fake reviews, testimonials, or unsupported
            performance claims. All monitoring data is measured directly from
            your system.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">6. Termination</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            You may delete your account at any time via "Delete my data" in
            settings. We may suspend accounts that violate these terms.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">7. Limitation of liability</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            The service is provided "as is" without warranties. We are not
            liable for indirect damages arising from use or inability to use the
            service.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">8. Changes to terms</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            We may update these terms from time to time. Continued use means
            you accept the updated terms.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">9. Contact</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            Contact us at{" "}
            <a href="mailto:support@os-resource-monitoring.example.com" className="text-[#65e6bd] underline underline-offset-4">
              support@os-resource-monitoring.example.com
            </a>
            .
          </p>

          <FileCheck className="mt-8 w-4 h-4 text-[#4b5a6e]" />
        </article>
      </section>
    </main>
  );
}
