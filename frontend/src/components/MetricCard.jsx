export default function MetricCard({ name, value, detail }) {
  return <article className="panel min-h-[132px] p-[17px_18px] max-[720px]:min-h-[119px] max-[720px]:p-3.5">
    <div className="flex items-center gap-2 text-xs text-[#9eacc3]"><span className="grid size-6 place-items-center rounded-md bg-[#1b3040] font-bold text-[#69e6c0]">{name.slice(0, 1)}</span>{name}<span className="ml-auto tracking-[2px] text-[#65748d]">•••</span></div>
    <strong className="my-3 block text-[27px] tracking-tight max-[720px]:text-[23px]">{value}</strong>
    <div className="text-[11px] text-[#8998b1]"><span className="status-dot !mr-1.5 !size-1.5" />{detail}</div>
  </article>;
}
