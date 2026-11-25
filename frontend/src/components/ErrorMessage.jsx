export function ErrorMessage({ message, onDismiss, details }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mb-4 rounded-xl border border-red-900/30 bg-red-950/10 p-4 text-sm"
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5" style={ { color: "var(--severity-critical)" } }>⚠</span>
        <div>
          <p className="font-semibold" style={ { color: "var(--text)" } }>{message}</p>
          {details && (
            <p className="mt-1 text-xs text-[#fca5a5]">{details}</p>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto text-xs text-[#ef4444] hover:text-[#fca5a5] focus:outline-none"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
