"use client";

import { useEffect, useMemo, useState } from "react";
import { COVER_W } from "@/components/bookFaces";
import type { Book } from "@/data/books";

type BookDetailProps = {
  book: Book;
  rect: DOMRect;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function BookDetail({ book, rect, onClose, onPrev, onNext }: BookDetailProps) {
  const [out, setOut] = useState(false);
  const [closing, setClosing] = useState(false);

  const pose = useMemo(() => {
    if (typeof window === "undefined") return { dx: 0, dy: 0, scale: 1, coverW: COVER_W };
    const narrow = window.innerWidth < 720;
    const coverH = Math.min(window.innerHeight * (narrow ? 0.42 : 0.6), narrow ? 340 : 480);
    const scale = coverH / rect.height;
    const coverW = COVER_W * scale;
    const targetLeft = narrow ? (window.innerWidth - coverW) / 2 : window.innerWidth * 0.19;
    const targetTop = narrow ? 92 : (window.innerHeight - coverH) / 2;
    return { dx: targetLeft - rect.left, dy: targetTop - rect.top, scale, coverW };
  }, [rect]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOut(true));
    return () => window.cancelAnimationFrame(frame);
  }, [book.id]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") retract();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function retract() {
    setClosing(true);
    setOut(false);
    window.setTimeout(onClose, 620);
  }

  const transform = out
    ? `translate3d(${pose.dx}px, ${pose.dy}px, 0) scale(${pose.scale}) rotateY(-90deg)`
    : "translate3d(0, 0, 0) scale(1) rotateY(-26deg)";

  return (
    <div className={closing ? "detail-layer closing" : "detail-layer"}>
      <button className="detail-backdrop" type="button" aria-label="Close book" onClick={retract} />
      <div
        className="detail-book"
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          transform,
          "--spine": book.spine,
          "--ink": book.ink,
        } as React.CSSProperties}
      >
        <div className="detail-cover" style={{ width: COVER_W }}>
          {book.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.cover} alt={`${book.title} cover`} />
          ) : (
            <div className="fallback-cover">
              <strong>{book.title}</strong>
              <small>{book.author}</small>
            </div>
          )}
        </div>
      </div>
      <aside className="detail-panel">
        <p className="mono-label">{book.recommender ? `Recommended by ${book.recommender}` : book.finished ? `Finished ${book.finished}` : "Selected volume"}</p>
        <h2>{book.title}</h2>
        <p className="detail-author">{book.author}</p>
        <p className="detail-blurb">{book.blurb || "No blurb is available yet."}</p>
        <div className="detail-facts">
          <span>{book.year || "Unknown year"}</span>
          <span>{book.publisher || "Unknown publisher"}</span>
          <span>{book.rating ? `${book.rating}/5 stars` : "Unrated"}</span>
        </div>
        <div className="detail-controls">
          <button type="button" onClick={onPrev} aria-label="Previous book">
            {"<"}
          </button>
          <button type="button" onClick={retract}>Shelve it</button>
          <button type="button" onClick={onNext} aria-label="Next book">
            {">"}
          </button>
        </div>
      </aside>
    </div>
  );
}
