const items = ["Overview", "Processes", "Analytics", "Alerts", "Settings"];

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-[250px] shrink-0 flex-col border-r border-[#202c40] bg-[#0e1727] px-[18px] py-[30px] max-[720px]:min-h-0 max-[720px]:w-full max-[720px]:border-r-0 max-[720px]:border-b max-[720px]:px-4 max-[720px]:py-3">
      <h2 className="mx-2 text-[21px] font-bold tracking-tight max-[720px]:mx-0 max-[720px]:text-lg"><span className="mr-2 text-[#67e4bd]">◈</span>ParindeOS</h2>
      <p className="my-[34px] mx-[10px] text-[11px] font-bold tracking-[1.2px] text-[#f1c875] max-[720px]:hidden"><span className="status-dot amber" />DEMO MODE</p>
      <nav aria-label="Main navigation" className="grid gap-1.5 max-[720px]:mt-3 max-[720px]:flex max-[720px]:gap-1.5 max-[720px]:overflow-x-auto">
        {items.map((item, i) => <a key={item} href={`#${item.toLowerCase()}`} className={`rounded-lg px-3.5 py-3 text-sm transition-colors max-[720px]:shrink-0 max-[720px]:px-3 max-[720px]:py-2.5 max-[720px]:text-xs ${i === 0 ? "bg-[#19303b] text-[#69e6c0]" : "text-[#9eacc3] hover:bg-[#172638] hover:text-white"}`}>{item}</a>)}
      </nav>
      <div className="mt-auto border-t border-[#202c40] px-2 pt-4 text-[11px] leading-7 text-[#77869f] max-[720px]:hidden">ParindeOS Monitor<br />Version 1.0 · Preview</div>
    </aside>
  );
}
