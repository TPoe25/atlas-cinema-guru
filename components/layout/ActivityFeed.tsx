import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecentActivities } from "@/lib/data";

export default async function ActivityFeed() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const activities = await getRecentActivities(session.user.id);

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Recent Activity
      </h2>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-slate-900/60 p-3">
            <p className="text-sm text-slate-400">No activity yet.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl border border-[var(--border)] bg-slate-900/60 p-3"
            >
              <p className="text-sm text-slate-200">
                {activity.type === "FAVORITE" ? "Favorited" : "Added to watch later"}{" "}
                <span className="font-semibold">“{activity.title.name}”</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
