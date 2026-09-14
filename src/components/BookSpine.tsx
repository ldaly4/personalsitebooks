"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COVER_W, faceFont } from "@/components/bookFaces";
import type { Book } from "@/data/books";

type BookSpineProps = {
  book: Book;
  onOpen: (rect: DOMRect) => void;
  active?: boolean;
  shelveIn?: boolean;
};

function ratingLabel(rating: number) {
  if (!rating) return "Unrated";
  return `${rating}/5`;
}

export function BookSpine({ book, onOpen, active = false, shelveIn = false }: BookSpineProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
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
    const rect = buttonRef.current?.getBoundingClientRect();
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
    const rect = buttonRef.current?.getBoundingClientRect();
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
      <button
        ref={buttonRef}
        className={shelveIn ? "book-hit animate-shelve-in" : "book-hit"}
        style={style}
        type="button"
        onClick={openBook}
        onFocus={showCard}
        onBlur={hideCard}
        onMouseEnter={showCard}
        onMouseLeave={hideCard}
      >
        <span className={`book-object ${book.finish} ${book.binding}`}>
          <span className="book-face">
            {book.spineImage && <span className="spine-image" style={{ backgroundImage: `url(${book.spineImage})` }} />}
            <span className="spine-base" />
            <span className="spine-rule top" />
            <span className="spine-rule bottom" />
            <span className={`spine-title ${faceFont[book.face]} ${book.caps ? "caps" : ""}`}>{book.title}</span>
            {book.width >= 44 && <span className="spine-author">{book.author}</span>}
            {book.width >= 30 && <span className="publisher-mark">{book.publisher.slice(0, 3) || "LIB"}</span>}
            <span className="spine-texture" />
            <span className="spine-sheen" />
            <span className="spine-wear" />
            <span className="spine-highlight" />
          </span>
          <span className="front-cover" style={{ width: COVER_W }}>
            {book.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.cover} alt="" />
            ) : (
              <span className="fallback-cover">
                <strong>{book.title}</strong>
                <small>{book.author}</small>
              </span>
            )}
          </span>
          <span className="page-block" />
          {book.binding === "hardcover" && <span className="headband" />}
        </span>
      </button>

      {hovered &&
        card &&
        createPortal(
          <aside className="hover-card" style={{ left: card.left, top: card.top }} onMouseEnter={showCard} onMouseLeave={hideCard}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <div className="hover-meta">
              <span>{book.year || "Unknown"}</span>
              <span>{book.binding}</span>
              <span>{ratingLabel(book.rating)}</span>
            </div>
            {book.genres?.length ? (
              <div className="hover-genres">
                {book.genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>
            ) : null}
          </aside>,
          document.body,
        )}
    </>
  );
}
