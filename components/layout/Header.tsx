import LogoutButton from "@/components/auth/LogoutButton";

type HeaderProps = {
  email: string;
};

export default function Header({ email }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-[var(--border)] bg-[#0f172a] px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-violet-400">
          TaylorMDB
        </p>
        <h1 className="text-xl font-bold text-white">Cinema Guru</h1>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-300">{email}</p>
        <LogoutButton />
      </div>
    </header>
  );
}
