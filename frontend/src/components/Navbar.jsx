export default function Navbar({ userEmail, realtimeStatus, onSignOut }) {
  const live = realtimeStatus === "live";
  return <header className="mb-6 flex items-center justify-between gap-5 max-[720px]:mb-4 max-[720px]:items-start max-[720px]:flex-col">
    <div><p className="eyebrow">SYSTEM MONITOR / OVERVIEW</p><h1 className="m-0 text-[clamp(30px,3vw,42px)] font-bold tracking-[-1.4px]">Dashboard</h1></div>
    <div className="flex items-center gap-3 max-[520px]:flex-wrap">
      <span className={`whitespace-nowrap rounded-full border px-3.5 py-2.5 text-xs ${live ? "border-[#245047] bg-[#112b2a] text-[#76e8c4]" : "border-[#58482a] bg-[#282316] text-[#eacb82]"}`}><span className={`status-dot ${live ? "" : "amber"}`} />{realtimeStatus === "demo" ? "Demo data" : live ? "Realtime connected" : realtimeStatus === "waiting" ? "Waiting for system" : realtimeStatus === "offline" ? "Realtime unavailable" : "Connecting to Realtime"}</span>
      {userEmail && <span className="max-w-44 truncate text-xs text-[#9eacc3]" title={userEmail}>{userEmail}</span>}
      {onSignOut && <button type="button" onClick={onSignOut} className="rounded-lg border border-[#30405b] px-3 py-2 text-xs text-[#c1ccdc] hover:bg-[#182337]">Sign out</button>}
    </div>
  </header>;
}
