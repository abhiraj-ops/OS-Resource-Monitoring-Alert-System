import { Menu, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileNav({ isOpen, onToggle }) {
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", path: "/dashboard", icon: "◈" },
    { label: "Processes", path: "/processes", icon: "⚙" },
    { label: "Analytics", path: "/analytics", icon: "📊" },
    { label: "Alerts", path: "/alerts", icon: "🚨" },
    { label: "Settings", path: "/settings", icon: "🔧" },
    { label: "Privacy Policy", path: "/privacy", icon: "🔒" },
    { label: "Terms of Service", path: "/terms", icon: "📄" },
    { label: "Refund Policy", path: "/refund", icon: "💰" },
    { label: "Delete my data", path: "/delete-account", icon: "🗑" },
  ];

  return (
    <div
      className={`fixed inset-0 z-[60] bg-[#0e1727] border-r border-[#202c40] transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#202c40]">
        <h2 className="text-lg font-bold text-[#edf2fb]">Menu</h2>
        <button
          onClick={onToggle}
          className="rounded-lg p-2 text-[#c1ccdc] hover:bg-[#182337] focus:outline-none"
          aria-label="Close menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <nav className="p-4 space-y-2" aria-label="Main navigation">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              onToggle();
            }}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-3 text-left text-sm text-[#9eacc3] hover:bg-[#172638] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
          >
            <span className="shrink-0 text-[#65e6bd]">{item.icon}</span>
            {item.label}
            <ChevronRight className="ml-auto w-4 h-4 text-[#4b5a6e]" />
          </button>
        ))}
      </nav>
    </div>
  );
}

export default MobileNav;
