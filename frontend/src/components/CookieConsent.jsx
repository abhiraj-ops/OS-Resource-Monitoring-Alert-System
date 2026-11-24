import { useState, useEffect } from "react";
import { SITE_CONFIG } from "../config/site.js";

export function CookieConsent() {
  const [accepted, setAccepted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("cookie_consent") === "true";
  });

  useEffect(() => {
    if (accepted) {
      localStorage.setItem("cookie_consent", "true");
      document.dispatchEvent(new CustomEvent("cookie_consent_accepted"));
    }
  }, [accepted]);

  if (accepted) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-[#111b2c] border-t border-[#25334b] p-6 z-50 shadow-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-9">
          <p className="eyebrow mb-2 text-[#7e91b2]">Cookie consent</p>
          <h3 className="text-lg font-bold text-[#edf2fb] mb-2">
            We use essential cookies only
          </h3>
          <p className="text-sm text-[#8190a9] leading-relaxed">
            This site uses only essential cookies required for authentication and
            session security. No advertising or tracking cookies are used. You can
            withdraw consent at any time in your browser settings.
          </p>
        </div>
        <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => setAccepted(true)}
            className="rounded-lg bg-[#1b8067] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#219477] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            Accept
          </button>
          <button
            onClick={() => {
              setAccepted(true);
            }}
            className="rounded-lg border border-[#30405b] px-4 py-2.5 text-sm text-[#c1ccdc] hover:bg-[#182337] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            Manage settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
