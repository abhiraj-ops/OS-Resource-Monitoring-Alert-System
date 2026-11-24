import { useState } from "react";
import { Rocket, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: "welcome", title: "Welcome", subtitle: "Get started with OS monitoring" },
  { id: "connect", title: "Connect your system", subtitle: "Install the monitoring agent" },
  { id: "thresholds", title: "Set alert thresholds", subtitle: "Configure CPU, memory, disk limits" },
  { id: "finish", title: "You're all set", subtitle: "Dashboard is ready" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const next = () => {
    if (isLast) {
      setCompleted(true);
      navigate("/dashboard");
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <main className="min-h-screen bg-[#090e19] px-4 text-[#edf2fb]">
      {completed ? (
        <section className="panel p-10 max-w-md mx-auto py-10 text-center">
          <Rocket className="mx-auto mb-6 w-12 h-12 text-[#65e6bd]" />
          <h1 className="text-2xl font-bold mb-2">You're all set!</h1>
          <p className="text-sm text-[#8190a9] mb-6">
            Your monitoring dashboard is ready. Start tracking CPU, memory, disk,
            and network usage in real time.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-[#1b8067] w-full px-4 py-3 text-sm font-semibold text-white hover:bg-[#219477] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            Go to dashboard
          </button>
        </section>
      ) : (
        <section className="panel p-8 max-w-md mx-auto py-6">
          <div className="mb-6">
            <div className="w-full bg-[#202c40] rounded-full h-1.5 mb-3">
              <div
                className="bg-[#65e6bd] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-[#8190a9] text-center">
              Step {stepIndex + 1} of {steps.length}
            </p>
          </div>

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#1b3040] flex items-center justify-center mx-auto mb-4 text-[#65e6bd] font-bold text-xl">
              {stepIndex + 1}
            </div>
            <h2 className="text-xl font-bold mb-2">{step.title}</h2>
            <p className="text-sm text-[#8190a9]">{step.subtitle}</p>
          </div>

          <div className="space-y-4 text-sm text-[#c1ccdc]">
            {step.id === "welcome" && (
              <>
                <p>OS Resource Monitoring helps you track Linux system resources in real time.</p>
                <p>We will guide you through connecting your first system.</p>
              </>
            )}
            {step.id === "connect" && (
              <>
                <p>Install the Python monitoring agent on your Ubuntu machine.</p>
                <p className="font-mono text-xs text-[#4b5a6e] bg-[#111b2c] p-3 rounded mb-2">
                  pip install psutil supabase-py
                </p>
                <p>Then register your system in the dashboard.</p>
              </>
            )}
            {step.id === "thresholds" && (
              <>
                <p>Set alert thresholds for CPU, memory, and disk usage.</p>
                <p>You will receive WARNING and CRITICAL alerts when limits are crossed.</p>
              </>
            )}
            {step.id === "finish" && (
              <p>Explore your dashboard to view live metrics and alerts.</p>
            )}
          </div>

          <div className="flex justify-between mt-8">
            {stepIndex > 0 && (
              <button
                onClick={() => setStepIndex((i) => i - 1)}
                className="rounded-lg px-4 py-2 text-sm text-[#8190a9] hover:text-white hover:bg-[#182337] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              className="rounded-lg bg-[#1b8067] px-4 py-2 text-sm font-semibold text-white hover:bg-[#219477] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
            >
              {isLast ? "Finish" : "Next"} <ArrowRight className="ml-1 w-3 h-3" />
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
