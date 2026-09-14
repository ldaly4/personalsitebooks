const messages = [
  "Patrick has England. Stress levels already rising.",
  "Lucy is Brazil-powered and dangerous.",
  "Luke O'C has Portugal and Morocco. Serious dark horse energy.",
  "Willie has Spain, Belgium and Croatia. Suspiciously strong.",
  "Holly's France pick is giving favourite energy.",
  "Luke K has Argentina insurance.",
  "Tracey is quietly building a tournament machine.",
  "Alice has Germany and Japan. Group-stage menace behaviour.",
];

export function ChaosTicker() {
  const tickerItems = [...messages, ...messages];

  return (
    <section className="my-6 overflow-hidden rounded-2xl border-y-2 border-yellow-300 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 py-2 text-green-950 shadow-2xl">
      <div className="ticker-track flex w-max gap-8 px-4">
        {tickerItems.map((message, index) => (
          <p key={`${message}-${index}`} className="whitespace-nowrap text-sm font-black uppercase tracking-wide sm:text-base">
            ⚽ {message}
          </p>
        ))}
      </div>
    </section>
  );
}
