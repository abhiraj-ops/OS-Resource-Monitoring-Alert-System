import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ResourceChart from "../components/ResourceChart.jsx";
import ProcessTable from "../components/ProcessTable.jsx";
import AlertPanel from "../components/AlertPanel.jsx";

const metrics = [
  { name: "CPU", value: "42%", detail: "Demo data" },
  { name: "RAM", value: "6.4 GB", detail: "of 16 GB · Demo data" },
  { name: "Disk", value: "58%", detail: "Demo data" },
  { name: "Network", value: "24 MB/s", detail: "Demo data" },
];

export default function Dashboard() {
  return <main className="flex min-h-screen max-[720px]:block">
    <Sidebar />
    <section className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
      <Navbar />
      <div className="mb-[18px] flex flex-wrap items-center gap-2.5 rounded-[10px] border border-[#58482a] bg-[#282316] px-4 py-3 text-[13px] text-[#eacb82] max-[520px]:flex-col max-[520px]:items-start"><strong className="text-[#ffd77e]">Demo preview</strong><span>Showing sample metrics. Live system data is not connected.</span></div>
      <section className="mb-4 grid grid-cols-4 gap-3.5 max-[1000px]:grid-cols-2 max-[380px]:grid-cols-1" aria-label="System metrics">
        {metrics.map(metric => <MetricCard key={metric.name} {...metric} />)}
      </section>
      <section className="mb-4 grid grid-cols-[minmax(0,1.8fr)_minmax(270px,1fr)] gap-4 max-[1000px]:grid-cols-[minmax(0,1.5fr)_minmax(230px,1fr)] max-[720px]:grid-cols-1">
        <ResourceChart /><AlertPanel />
      </section>
      <ProcessTable />
      <footer className="flex justify-between gap-3 px-0.5 text-[10px] text-[#738199] max-[520px]:flex-col">ParindeOS Dashboard <span className="text-[#5f6e85]">Demo interface · Not connected to live metrics</span></footer>
    </section>
  </main>;
}
