import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = 24, message = "Loading…" }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-8"
      role="status"
      aria-label={message}
      aria-live="polite"
    >
      <div className="relative w-[size] h-[size]">
        <Loader2
          className="w-full h-full text-[#65e6bd] animate-spin"
          size={size}
          strokeWidth="2"
        />
      </div>
      <p className="text-xs text-[#8190a9]">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
