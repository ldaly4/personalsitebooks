import type { LeaderboardRow } from "@/lib/sweepstake";
import { OwnerStickerCard } from "./owner-sticker-card";

export function OwnerCardGrid({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <section className="py-8" id="owners">
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-200">Owners</p>
        <h2 className="text-4xl font-black">Sticker-card contenders</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <OwnerStickerCard key={row.ownerId} row={row} />
        ))}
      </div>
    </section>
  );
}
