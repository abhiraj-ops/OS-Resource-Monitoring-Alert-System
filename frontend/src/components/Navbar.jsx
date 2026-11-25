import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, LogOut, Globe, ShieldCheck } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";
import MobileNav from "./MobileNav.jsx";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Processes", href: "/processes" },
  { label: "Analytics", href: "/analytics" },
  { label: "Alerts", href: "/alerts" },
  { label: "Settings", href: "/settings" },
];

export default function Navbar({ userEmail, realtimeStatus, onSignOut }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { theme, cycleTheme, themeInfo } = useTheme();
  const live = realtimeStatus === "online";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = () => {
    onSignOut();
    navigate("/login");
  };

  const statusConfig = live
    ? { label: "LIVE", color: "#22c55e", bg: "rgba(34,197,94,0.12)" }
    : realtimeStatus === "offline"
      ? { label: "OFFLINE", color: "#ef4444", bg: "rgba(239,68,68,0.12)" }
      : { label: "DEGRADED", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" };

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <header
        className={`sticky top-0 z-[500] border-b transition ${
          scrolled
            ? "bg-[#0a0f1d]/82 backdrop-blur-[14px] backdrop-saturate-[140%]"
            : "bg-transparent"
        }`}
        style={{
          borderColor: "var(--border)",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : undefined,
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : undefined,
        }}
        aria-label="Header"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-2.5">
            <span
              className="relative flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, var(--accent-strong), var(--accent))",
                boxShadow: "0 0 22px color-mix(in srgb, var(--accent) 45%, transparent)",
              }}
            >
              <Globe className="h-5 w-5" style={ { color: "var(--accent-contrast)" } } aria-hidden="true" />
              <span
                className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5"
                aria-hidden="true"
              >
                <span
                  className="absolute h-full w-full animate-ping rounded-full opacity-75"
                  style={ { background: "var(--accent)" } }
                />
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={ { background: "var(--accent)" } }
                />
              </span>
            </span>
            <span className="text-base font-extrabold tracking-tight sm:text-lg" style={ { color: "var(--text)" } }>
              OS<span style={ { color: "var(--accent)" } }>Monitor</span>
            </span>
          </div>

          <nav
            className="hidden items-center gap-7 text-sm font-medium lg:flex"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="transition-colors hover:opacity-100"
                style={ { color: "var(--text-muted)" } }
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider sm:inline-flex`}
              style={ { borderColor: "var(--border)", background: statusConfig.bg, color: statusConfig.color, title: "System status" } }
            >
              <span className="h-1.5 w-1.5 rounded-full" style={ { background: statusConfig.color } } />
              {statusConfig.label}
            </span>
            <ThemeToggle theme={theme} cycleTheme={cycleTheme} />
            <a
              href="/dashboard"
              className="btn btn-primary hidden !py-2 sm:inline-flex"
            >
              Live Command Center
            </a>
            <button
              type="button"
              className="btn btn-ghost !px-2.5 !py-2 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <xe className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-nav"
            className="border-t px-4 pb-4 pt-2 lg:hidden"
            style={{
              borderColor: "var(--border)",
              background: "color-mix(in srgb, var(--bg) 94%, transparent)",
              backdropFilter: "blur(14px)",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium"
                style={ { color: "var(--text-muted)" } }
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary mt-2 w-full"
            >
              Live Command Center
            </a>
          </div>
        )}
      </header>

      <MobileNav isOpen={mobileOpen} onToggle={() => setMobileOpen(false)} />
    </>
  );
}

function xe({ className }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ThemeToggle({ theme, cycleTheme }) {
  const info = themeInfo[theme];
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(0);

  return (
    <div className="relative" aria-label="Theme selector">
      <button
        type="button"
        className="btn btn-ghost !px-3 !py-2"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Theme: ${info.label}. Change theme`}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="h-7 w-7 shrink-0 rounded-lg border"
          style={{
            background: `linear-gradient(135deg, ${themeColors[theme][0]} 0%, ${themeColors[theme][1]} 55%, ${themeColors[theme][2]} 100%)`,
            borderColor: "var(--border-strong)",
          }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{info.label}</span>
      </button>
      {open && (
        <div
          role="radiogroup"
          aria-label="Colour theme"
          className="glass absolute right-0 z-50 mt-2 w-60 overflow-hidden p-1.5"
          style={{ borderColor: "var(--border)" }}
        >
          {THEMES.map((t, i) => (
            <button
              key={t}
              role="radio"
              aria-checked={theme === t}
              tabIndex={i === hoverIdx ? 0 : -1}
              onClick={() => {
                cycleTheme();
                setOpen(false);
              }}
              onMouseEnter={() => setHoverIdx(i)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition"
              style={{
                background:
                  theme === t
                    ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                    : "transparent",
              }}
            >
              <span
                className="h-7 w-7 shrink-0 rounded-lg border"
                style={{
                  background: `linear-gradient(135deg, ${themeColors[t][0]} 0%, ${themeColors[t][1]} 55%, ${themeColors[t][2]} 100%)`,
                  borderColor: "var(--border-strong)",
                }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span
                  className="block text-sm font-semibold"
                  style={ { color: "var(--text)" } }
                >
                  {themeInfo[t].label}
                </span>
                <span className="block text-[11px]" style={ { color: "var(--text-subtle)" } }>
                  {themeInfo[t].hint}
                </span>
              </span>
              {theme === t && (
                <Check className="h-4 w-4" style={ { color: "var(--accent)" } } />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const THEMES = ["midnight", "aurora", "frost", "graphite"];

const themeColors = {
  midnight: ["#0a0f1d", "#0284c7", "#38bdf8"],
  aurora: ["#060b16", "#10b981", "#8b5cf6"],
  frost: ["#eef4fb", "#0369a1", "#93c5fd"],
  graphite: ["#050607", "#525252", "#fafafa"],
};

const themeInfo = {
  midnight: { label: "Midnight", hint: "Deep navy with cyan glows" },
  aurora: { label: "Aurora", hint: "Teal and violet gradients" },
  frost: { label: "Frost", hint: "Light glass, soft blue and white" },
  graphite: { label: "Graphite", hint: "Near-black, high contrast" },
};

function Check({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
