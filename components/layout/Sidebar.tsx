import Link from "next/link";
import ActivityFeed from "@/components/layout/ActivityFeed";

export default function Sidebar() {
  return (
    <aside className="group h-screen w-20 overflow-hidden border-r border-[var(--border)] bg-[#081120] px-4 py-6 transition-all duration-300 hover:w-72">
      <div className="flex h-full flex-col">
        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-lg font-bold text-white">
            CG
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            className="flex items-center rounded-xl px-3 py-3 text-slate-200 transition hover:bg-slate-800"
          >
            <span className="min-w-[24px] text-center">🏠</span>
            <span className="ml-4 hidden whitespace-nowrap group-hover:inline">
              Home
            </span>
          </Link>

          <Link
            href="/favorites"
            className="flex items-center rounded-xl px-3 py-3 text-slate-200 transition hover:bg-slate-800"
          >
            <span className="min-w-[24px] text-center">⭐</span>
            <span className="ml-4 hidden whitespace-nowrap group-hover:inline">
              Favorites
            </span>
          </Link>

          <Link
            href="/watch-later"
            className="flex items-center rounded-xl px-3 py-3 text-slate-200 transition hover:bg-slate-800"
          >
            <span className="min-w-[24px] text-center">🕒</span>
            <span className="ml-4 hidden whitespace-nowrap group-hover:inline">
              Watch Later
            </span>
          </Link>
        </nav>

        <div className="mt-6 hidden group-hover:block">
          <ActivityFeed />
        </div>
      </div>
    </aside>
  );
}
