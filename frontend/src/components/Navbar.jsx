export default function Navbar() {
  return <header className="mb-6 flex items-center justify-between gap-5 max-[720px]:mb-4 max-[720px]:items-start max-[720px]:flex-col">
    <div><p className="eyebrow">SYSTEM MONITOR / OVERVIEW</p><h1 className="m-0 text-[clamp(30px,3vw,42px)] font-bold tracking-[-1.4px]">Dashboard</h1></div>
    <span className="whitespace-nowrap rounded-full border border-[#245047] bg-[#112b2a] px-3.5 py-2.5 text-xs text-[#76e8c4]"><span className="status-dot" />All systems operational</span>
  </header>;
}
