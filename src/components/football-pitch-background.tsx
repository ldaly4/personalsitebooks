export function FootballPitchBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pitch-root">
      <div className="absolute inset-0 pitch-stripes opacity-95" />
      <div className="absolute inset-0 pitch-noise opacity-50" />
      <div className="absolute inset-5 rounded-[32px] border border-white/25" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 sm:h-64 sm:w-64" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35" />
      <div className="absolute left-5 top-1/2 h-56 w-20 -translate-y-1/2 rounded-r-2xl border border-l-0 border-white/20 sm:w-40" />
      <div className="absolute right-5 top-1/2 h-56 w-20 -translate-y-1/2 rounded-l-2xl border border-r-0 border-white/20 sm:w-40" />
      <div className="absolute left-5 top-1/2 h-28 w-10 -translate-y-1/2 rounded-r-xl border border-l-0 border-white/20 sm:w-20" />
      <div className="absolute right-5 top-1/2 h-28 w-10 -translate-y-1/2 rounded-l-xl border border-r-0 border-white/20 sm:w-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,28,20,0.2)_55%,rgba(1,28,20,0.78)_100%)]" />
    </div>
  );
}
