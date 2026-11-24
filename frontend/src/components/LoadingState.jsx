export default function LoadingState({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-[#94a3b8]">
      <div className="spinner mb-8" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
