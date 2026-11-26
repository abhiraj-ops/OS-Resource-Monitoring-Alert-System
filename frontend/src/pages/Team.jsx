import { useState } from "react";
import { User, ShieldCheck, FileText, Rocket, Layers, Timer, Activity, Globe } from "lucide-react";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";

const teamMembers = [
  {
    initial: "AC",
    name: "Anirudh Chauhan",
    rollNo: "2401730062",
    role: "Student 1 — Core OS Implementation & Scheduling Algorithms",
    avatarColor: "#0ea5e9",
    responsibilities: [
      "Designed and implemented core CPU scheduling algorithms (FCFS, SJF, Priority NP/P, Round Robin, SRTF).",
      "Formulated discrete-event simulation engine with process state tracking.",
      "Implemented deterministic tie-breaking logic (Priority → Arrival Time → PID).",
      "Engineered Round Robin queue management and time-quantum arrival synchronization.",
      "Built CT, WT, TAT, RT calculation engine with preemptive & non-preemptive support.",
    ],
  },
  {
    initial: "KG",
    name: "Kaashvi Gupta",
    rollNo: "2401730180",
    role: "Student 2 — UI/UX Design & Visualization",
    avatarColor: "#10b981",
    responsibilities: [
      "Designed modern, responsive dashboard UI with 4-theme system (Midnight, Aurora, Frost, Graphite).",
      "Engineered dynamic Gantt chart visualization with proportional scaling and idle gap indicators.",
      "Developed multi-algorithm comparison module with interactive animated charts.",
      "Built glassmorphism components, sticky headers, and mobile-responsive layouts.",
      "Implemented accessible keyboard navigation, focus states, and screen-reader support.",
    ],
  },
  {
    initial: "DSY",
    name: "Divyam Sidhant Yadav",
    rollNo: "2401730220",
    role: "Student 3 — Testing, Performance & Compliance",
    avatarColor: "#8b5cf6",
    responsibilities: [
      "Authored automated test suite with unit and boundary test cases across all pages.",
      "Verified mathematical invariants (RT ≤ WT, WT = TAT − BT, ΣBT + Idle = Total).",
      "Conducted comparative performance benchmarks across multiple process workloads.",
      "Implemented compliance features: auth, validation, error tracking, analytics, cookie consent.",
      "Prepared project report, deployment config (Netlify + Streamlit), and documentation.",
    ],
  },
];

const futureScope = [
  {
    number: "1",
    title: "Multi-Level Queue Scheduling",
    description: "Implement multiple queues with different scheduling algorithms per queue.",
  },
  {
    number: "2",
    title: "Multi-Level Feedback Queue",
    description: "Dynamic queue movement based on process behavior and CPU burst history.",
  },
  {
    number: "3",
    title: "Animation Mode",
    description: "Animated step-by-step execution showing processes moving through ready queue.",
  },
  {
    number: "4",
    title: "Real-time OS Integration",
    description: "Integration with actual OS process data via Python monitoring agent for live demos.",
  },
  {
    number: "5",
    title: "Export & Reporting",
    description: "Export simulation results as PDF/CSV for academic submissions and viva.",
  },
];

export default function TeamPage() {
  const [expandedMember, setExpandedMember] = useState(null);

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement="Project Team and Designated Responsibilities page" />
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow">PROJECT TEAM / RESPONSIBILITIES</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Project Team &amp; Designated Responsibilities</h1>
          <p className="mt-3 text-[#64748b] text-sm max-w-2xl">
            Operating Systems Capstone Project — 3-Member Structured Division. Each member owns a clearly defined
            development domain with verifiable deliverables.
          </p>
        </div>

        {/* Team Members */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Team Members</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.rollNo}
                className="panel p-5 relative overflow-hidden group cursor-pointer"
                onClick={() => setExpandedMember(member.rollNo)}
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full blur-3xl" style={ { background: "color-mix(in srgb, var(--accent) 20%, transparent)" } } />
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full mb-3" style={ { background: `color-mix(in srgb, ${member.avatarColor} 20%, transparent)`, color: member.avatarColor } }>
                    <span className="font-bold text-sm">{member.initial}</span>
                  </div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-xs text-[#64748b] mb-2">{member.rollNo}</p>
                  <p className="text-xs font-semibold mb-2" style={ { color: "var(--accent)" } }>{member.role}</p>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" style={ { color: "var(--text-muted)" } } />
                    <span className="text-[10px] text-[#64748b]">Click to view responsibilities</span>
                  </div>
                </div>
                {expandedMember === member.rollNo && (
                  <div className="mt-3 pt-3 border-t border-[#1e293b]">
                    <ul className="space-y-1.5 text-sm text-[#c1ccdc]">
                      {member.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5 text-[#65e6bd]">▹</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Future Scope */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Rocket className="w-5 h-5" style={ { color: "var(--accent)" } } />
            <h2 className="text-xl font-bold">🔮 Future Scope</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {futureScope.map((item) => (
              <article
                key={item.number}
                className="panel p-4 rounded-xl border"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1b3040] shrink-0">
                    <span className="text-xs font-bold" style={ { color: "var(--accent)" } }>{item.number}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-[#8190a9] leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <footer className="mt-12 pt-6 border-t border-[#1e293b] text-[10px] text-[#64748b]">
          <p>Operating Systems Capstone Project · Structured Team Division · Verifiable Deliverables</p>
        </footer>
      </div>
    </main>
  );
}
