"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COVER_W, faceFont } from "@/components/bookFaces";
import type { SiteSection } from "@/data/sections";

type BookSpineProps = {
  book: SiteSection;
  onOpen: (rect: DOMRect) => void;
  active?: boolean;
};

export function BookSpine({ book, onOpen, active = false }: BookSpineProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const [card, setCard] = useState<{ left: number; top: number } | null>(null);
  const leaveTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    };
  }, []);

  function showCard() {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    const rect = linkRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHovered(true);
    setCard({ left: rect.left + rect.width / 2, top: rect.top - 14 });
  }

  function hideCard() {
    leaveTimer.current = window.setTimeout(() => {
      setHovered(false);
      setCard(null);
    }, 90);
  }

  function openBook() {
    const rect = linkRef.current?.getBoundingClientRect();
    if (rect) onOpen(rect);
  }

  const style = {
    "--spine-w": `${book.width}px`,
    "--book-h": `${book.height}px`,
    "--spine": book.spine,
    "--band": book.band ?? book.spine,
    "--ink": book.ink,
    "--wear": book.wear,
    "--lean": `${hovered || active ? 0 : book.lean}deg`,
    "--depth": `${book.depth}px`,
    "--pull": hovered ? "96px" : "0px",
    "--lift": hovered ? "-26px" : "0px",
  } as React.CSSProperties;

  return (
    <>
      <a
        ref={linkRef}
        className="book-hit"
        href={`#${book.id}`}
        style={style}
        aria-label={`Open ${book.title}`}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openBook();
        }}
        onFocus={showCard}
        onBlur={hideCard}
        onMouseEnter={showCard}
        onMouseLeave={hideCard}
      >
        <span className={`book-object ${book.finish} ${book.binding}`}>
          <span className="book-face">
            <span className="spine-base" />
            <span className="spine-rule top" />
            <span className="spine-rule bottom" />
            <span className={`spine-title ${faceFont[book.face]} ${book.caps ? "caps" : ""}`}>{book.title}</span>
            {book.width >= 44 && <span className="spine-author">{book.coverNote}</span>}
            {book.width >= 30 && <span className="publisher-mark">{book.publisher.slice(0, 3) || "LIB"}</span>}
            <span className="spine-texture" />
            <span className="spine-sheen" />
            <span className="spine-wear" />
            <span className="spine-highlight" />
          </span>
          <span className="front-cover" style={{ width: COVER_W }}>
            <span className="typeset-cover">
              <span className="cover-rule" />
              <strong>{book.title}</strong>
              <small>{book.coverNote}</small>
              <span className="cover-foil">{book.publisher}</span>
            </span>
          </span>
          <span className="page-block" />
          {book.binding === "hardcover" && <span className="headband" />}
        </span>
      </a>

      {hovered &&
        card &&
        createPortal(
          <aside className="hover-card" style={{ left: card.left, top: card.top }} onMouseEnter={showCard} onMouseLeave={hideCard}>
            <h3>{book.title}</h3>
            <p>{book.description}</p>
            <div className="hover-meta">
              <span>{book.coverNote}</span>
              <span>{book.binding}</span>
            </div>
          </aside>,
          document.body,
        )}
    </>
  );
}
