"use client";

import type { Team } from "@/lib/sweepstake-data";
import { TeamCard } from "./team-card";

export function TeamDetailModal({ team, onClose }: { team?: Team; onClose?: () => void }) {
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-green-950/80 p-4 backdrop-blur">
      <div className="max-w-xl">
        <button className="mb-3 rounded-full bg-yellow-300 px-4 py-2 font-black text-green-950" onClick={onClose}>
          Close
        </button>
        <TeamCard team={team} />
      </div>
    </div>
  );
}
