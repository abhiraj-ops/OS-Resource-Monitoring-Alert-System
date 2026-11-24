import { useEffect, useCallback } from "react";

export function useKeyboardNavigation() {
  const registerShortcut = useCallback((callback) => {
    const handler = (event) => {
      // Ctrl/Cmd + K -> global search
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        callback("global-search");
      }
      // Escape -> close modals / clear focus
      if (event.key === "Escape") {
        callback("escape");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return { registerShortcut };
}

export default useKeyboardNavigation;
