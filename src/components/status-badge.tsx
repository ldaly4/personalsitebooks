import type { TeamStatus } from "@/lib/sweepstake-data";

const statusClass: Record<TeamStatus, string> = {
  alive: "border-emerald-200/30 bg-emerald-500/18 text-emerald-50",
  live: "border-red-200/50 bg-red-500/25 text-red-50 animate-pulse",
  qualified: "border-yellow-200/50 bg-yellow-300 text-green-950",
  "at-risk": "border-amber-200/50 bg-amber-500/25 text-amber-50",
  eliminated: "border-white/15 bg-slate-500/30 text-slate-200",
  winner: "border-yellow-100 bg-yellow-300 text-green-950",
};

export function StatusBadge({ status }: { status: TeamStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${statusClass[status]}`}>
      {status.replace("-", " ")}
    </span>
  );
}
