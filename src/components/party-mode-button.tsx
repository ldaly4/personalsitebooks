"use client";

import { useState } from "react";

export function PartyModeButton({ ownerName }: { ownerName: string }) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setActive((value) => !value)}
      className={`rounded-full px-6 py-3 font-black shadow-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
        active ? "party-pulse bg-yellow-300 text-green-950" : "border border-white/20 bg-white/12 text-white hover:bg-white/20"
      }`}
    >
      {active ? `${ownerName} party mode is on` : "Start Wavin' Flag mode"}
    </button>
  );
}
