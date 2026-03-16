const mockActivities = [
  {
    id: 1,
    label: 'Added "Dune" to watch later',
    time: "Today · 2:14 PM",
  },
  {
    id: 2,
    label: 'Favorited "Interstellar"',
    time: "Today · 12:02 PM",
  },
  {
    id: 3,
    label: 'Added "Arrival" to watch later',
    time: "Yesterday · 8:41 PM",
  },
];

export default function ActivityFeed() {
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Recent Activity
      </h2>

      <div className="space-y-3">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-xl border border-[var(--border)] bg-slate-900/60 p-3"
          >
            <p className="text-sm text-slate-200">{activity.label}</p>
            <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
