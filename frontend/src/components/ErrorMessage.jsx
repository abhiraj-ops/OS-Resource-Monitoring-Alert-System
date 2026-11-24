export function ErrorMessage({ message, onDismiss, details }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mb-4 rounded-lg border border-red-900 bg-red-950/10 p-3 text-sm text-red-200"
    >
      <div className="flex items-start gap-2">
        <span className="shrink-0 mt-0.5">⚠</span>
        <div>
          <p className="font-semibold">{message}</p>
          {details && (
            <p className="mt-1 text-xs text-[#fca5a5]">{details}</p>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto text-xs text-red-400 hover:text-red-300 focus:outline-none"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
