import { useEffect, useState } from "react";
import AuthPanel from "./components/AuthPanel.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { supabase, supabaseConfigError, supabaseConfigured } from "./services/supabase.js";

function SetupNotice() {
  return <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
    <section className="panel max-w-xl p-8">
      <p className="eyebrow">SUPABASE CONFIGURATION</p>
      <h1 className="mb-3 text-2xl font-bold">Finish frontend configuration</h1>
      <p className="text-sm leading-relaxed text-[#9eacc3]">Set both <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code>frontend/.env.local</code>, then restart the Vite server. Use the publishable/anon key only; never use a service-role or secret key in this frontend.</p>
    </section>
  </main>;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setCheckingSession(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (supabaseConfigError) return <SetupNotice />;
  if (!supabaseConfigured) return <Dashboard demoMode />;
  if (checkingSession) return <main className="grid min-h-screen place-items-center bg-[#090e19] text-sm text-[#9eacc3]">Connecting to Supabase…</main>;
  if (!session) return <AuthPanel supabase={supabase} />;

  return <Dashboard supabase={supabase} session={session} />;
}
