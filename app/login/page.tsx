import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/auth/LoginButton";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          TaylorMDB
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">Cinema Guru</h1>
        <p className="mt-3 text-sm text-slate-400">
          Sign in to explore movies, save favorites, and build your watch later list.
        </p>

        <div className="mt-8">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
