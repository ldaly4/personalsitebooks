"use client";

import { useEffect, useState } from "react";

const FULL = "Welcome to my library";

export function TypedTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= FULL.length) return;
    const timer = window.setTimeout(() => setCount((value) => value + 1), 95);
    return () => window.clearTimeout(timer);
  }, [count]);

  return (
    <h1 className="typed-title" aria-label={FULL}>
      <span aria-hidden="true">{FULL.slice(0, count)}</span>
      <span className={count >= FULL.length ? "caret done" : "caret"} aria-hidden="true" />
    </h1>
  );
}
