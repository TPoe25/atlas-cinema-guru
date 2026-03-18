import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-white">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header email={session.user.email ?? "No email available"} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
