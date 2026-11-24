import { useState } from "react";
import { BookOpen, FileText } from "lucide-react";

export default function PrivacyPolicy() {
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
            <BookOpen className="w-5 h-5 text-[#65e6bd]" />
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xs text-[#8190a9] mb-6 uppercase tracking-wider">
            Last updated: November 24, 2026
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">1. Who we are</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            OS Resource Monitoring Ltd ("we", "us", "our") operates the OS
            Resource Monitoring platform. Contact us at{" "}
            <a href="mailto:privacy@os-resource-monitoring.example.com" className="text-[#65e6bd] underline underline-offset-4">
              privacy@os-resource-monitoring.example.com
            </a>
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">2. Data we collect</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            We collect only the personal data necessary to run the service:
          </p>
          <ul className="list-disc list-inside text-sm text-[#c1ccdc] mb-4 space-y-2">
            <li>Email address (for authentication and notifications)</li>
            <li>System hostname and operating system details</li>
            <li>CPU, memory, disk, network metrics you choose to send</li>
            <li>Process snapshots (PID, name, CPU, memory)</li>
            <li>Alert records you configure</li>
          </ul>

          <h2 className="text-lg font-bold mt-8 mb-3">3. How we use your data</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            Your data is used solely to provide the monitoring service, send
            alerts, and authenticate your account. We do not sell your data.
            We do not use it for advertising.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">4. Data storage &amp; security</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            Data is stored in PostgreSQL with Row Level Security (RLS) enabled.
            Each user can only access their own systems and telemetry. API keys
            and service credentials are never stored in frontend code.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">5. Your rights</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            You may request access to, correction of, or deletion of your data
            at any time. Use the "Delete my data" option in your account
            settings, or email{" "}
            <a href="mailto:privacy@os-resource-monitoring.example.com" className="text-[#65e6bd] underline underline-offset-4">
              privacy@os-resource-monitoring.example.com
            </a>
            .
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">6. Children</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            We do not knowingly collect data from children under 13. Account
            creation requires age confirmation of 13+.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">7. Cookies</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            Only essential session cookies are used. No advertising or tracking
            cookies. See our cookie banner on first visit.
          </p>

          <h2 className="text-lg font-bold mt-8 mb-3">8. Contact us</h2>
          <p className="text-sm text-[#c1ccdc] mb-4">
            For privacy questions, contact{" "}
            <a href="mailto:privacy@os-resource-monitoring.example.com" className="text-[#65e6bd] underline underline-offset-4">
              privacy@os-resource-monitoring.example.com
            </a>
            .
          </p>

          <FileText className="mt-8 w-4 h-4 text-[#4b5a6e]" />
        </article>
      </section>
    </main>
  );
}
