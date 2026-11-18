import { useState } from "react";

export default function AuthPanel({ supabase }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    setSubmitting(false);
  }

  return <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
    <section className="panel w-full max-w-md p-8">
      <p className="eyebrow">PARINDEOS / AUTHENTICATION</p>
      <h1 className="mb-2 text-3xl font-bold">Sign in</h1>
      <p className="mb-6 text-sm text-[#9eacc3]">Use the Supabase test account shared by your backend developer.</p>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm text-[#b8c4d8]">Email
          <input autoComplete="username" className="rounded-lg border border-[#30405b] bg-[#0c1422] px-3 py-2.5 text-white outline-none focus:border-[#65e6bd]" type="email" required value={email} onChange={event => setEmail(event.target.value)} />
        </label>
        <label className="grid gap-1.5 text-sm text-[#b8c4d8]">Password
          <input autoComplete="current-password" className="rounded-lg border border-[#30405b] bg-[#0c1422] px-3 py-2.5 text-white outline-none focus:border-[#65e6bd]" type="password" required value={password} onChange={event => setPassword(event.target.value)} />
        </label>
        {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-200">{error}</p>}
        <button disabled={submitting} className="mt-1 rounded-lg bg-[#1b8067] px-4 py-3 font-semibold text-white transition hover:bg-[#219477] disabled:cursor-wait disabled:opacity-60">{submitting ? "Signing in…" : "Sign in to dashboard"}</button>
      </form>
      <p className="mt-5 text-xs leading-relaxed text-[#75849d]">Access is restricted by Supabase Row Level Security. No service-role key is used in this browser.</p>
    </section>
  </main>;
}
