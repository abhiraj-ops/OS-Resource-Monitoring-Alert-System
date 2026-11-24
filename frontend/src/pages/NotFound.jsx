import { ShieldAlert } from "lucide-react";

export function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#090e19] px-4 text-[#edf2fb]">
      <section className="panel p-10 text-center max-w-lg">
        <ShieldAlert className="mx-auto mb-6 w-12 h-12 text-[#f2bf60]" />
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-[#8190a9] mb-6">
          The page you are looking for does not exist. It may have been moved or
          deleted.
        </p>
        <a
          href="/dashboard"
          className="inline-block rounded-lg bg-[#1b8067] px-6 py-3 text-sm font-semibold text-white hover:bg-[#219477] focus:outline-none focus:ring-2 focus:ring-[#65e6bd]"
        >
          Return to dashboard
        </a>
      </section>
    </main>
  );
}

export default NotFound;
