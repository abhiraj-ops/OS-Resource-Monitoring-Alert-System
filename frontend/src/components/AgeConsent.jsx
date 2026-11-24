import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function AgeConsent({ onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  const [minimumAge] = useState(13);

  if (confirmed) return null;

  return (
    <section
      className="panel p-6 max-w-md mx-auto mb-6"
      role="dialog"
      aria-modal="true"
      aria-label="Age consent"
    >
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="shrink-0 w-5 h-5 text-[#f2bf60]" />
        <div>
          <h3 className="text-lg font-bold text-[#edf2fb]">Age confirmation</h3>
          <p className="text-sm text-[#8190a9] mt-1">
            You must be at least {minimumAge} years old to create an account.
          </p>
        </div>
      </div>
      <p className="text-sm text-[#c1ccdc] mb-6">
        By continuing, you confirm you are {minimumAge}+ and agree to our{" "}
        <a href="/terms" className="text-[#65e6bd] underline underline-offset-4">
          Terms of Service
        </a>
        and{" "}
        <a href="/privacy" className="text-[#65e6bd] underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
      <button
        onClick={() => {
          setConfirmed(true);
          onConfirm();
        }}
        className="rounded-lg bg-[#1b8067] w-full px-4 py-3 text-sm font-semibold text-white hover:bg-[#219477] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
      >
        I confirm I am {minimumAge}+
      </button>
    </section>
  );
}

export default AgeConsent;
