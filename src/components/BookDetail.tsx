"use client";

import { useEffect, useMemo, useState } from "react";
import { COVER_W } from "@/components/bookFaces";
import type { SiteSection } from "@/data/sections";

type BookDetailProps = {
  book: SiteSection;
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
          "--band": book.band ?? book.spine,
          "--ink": book.ink,
        } as React.CSSProperties}
      >
        <div className="detail-cover" style={{ width: COVER_W }}>
          <div className="typeset-cover detail-typeset-cover">
            <span className="cover-rule" />
            <strong>{book.title}</strong>
            <small>{book.coverNote}</small>
            <span className="cover-foil">{book.publisher}</span>
          </div>
        </div>
      </div>
      <article className="detail-panel" tabIndex={-1}>
        <p className="mono-label">{book.coverNote}</p>
        <h2>{book.title}</h2>
        <p className="detail-author">{book.description}</p>
        <div className="section-scroll">
          <p className="detail-blurb">{book.contentIntro}</p>
          {book.blocks.map((block) => (
            <section className="section-block" key={block.heading}>
              {block.imageLabel && <div className="section-image-placeholder">{block.imageLabel}</div>}
              <h3>{block.heading}</h3>
              <p>{block.body}</p>
              {block.items?.length ? (
                <ul>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {block.links?.length ? (
                <div className="section-links">
                  {block.links.map((link) => (
                    <a href={link.href} key={link.label}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
        <div className="detail-controls">
          <button type="button" onClick={onPrev} aria-label="Previous book">
            {"<"}
          </button>
          <button type="button" onClick={retract}>Back to shelf</button>
          <button type="button" onClick={onNext} aria-label="Next book">
            {">"}
          </button>
        </div>
      </article>
    </div>
  );
}
