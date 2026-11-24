export function EmptyState({
  title = "No data available",
  message = "There is nothing to display right now.",
  action,
  actionLabel,
  icon = "📭",
}) {
  return (
    <section className="panel p-10 text-center max-w-md mx-auto">
      <div className="text-4xl mb-4" aria-hidden="true">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-[#edf2fb] mb-2">{title}</h2>
      <p className="text-[#8190a9] text-sm mb-6">{message}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="rounded-lg border border-[#30405b] px-4 py-2 text-sm text-[#c1ccdc] hover:bg-[#182337] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}

export default EmptyState;
