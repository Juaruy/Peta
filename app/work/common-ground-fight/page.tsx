import Link from "next/link";

export const metadata = {
  title: "Common Ground Fight",
};

export default function CommonGroundFightPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-6 text-center text-white">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Work</p>

      <h1 className="mt-4 font-aeonik text-4xl font-medium tracking-[-0.04em] md:text-6xl">
        Common Ground Fight
      </h1>

      <p className="mt-6 max-w-md text-base leading-[1.6] text-white/60">
        Case study coming soon.
      </p>

      <Link
        href="/#work"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-white hover:text-black"
      >
        ← Back to Work
      </Link>
    </main>
  );
}
