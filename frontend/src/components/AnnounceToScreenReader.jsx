import { useEffect } from "react";

export function AnnounceToScreenReader({ announcement }) {
  useEffect(() => {
    if (!announcement) return;
    const existing = document.getElementById("sr-announcer");
    if (existing) existing.remove();
    const announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "fixed -top-[10000px] left-0 w-1 h-1 overflow-hidden";
    announcer.textContent = announcement;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  }, [announcement]);
  return null;
}

export default AnnounceToScreenReader;
