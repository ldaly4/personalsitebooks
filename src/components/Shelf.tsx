"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookDetail } from "@/components/BookDetail";
import { BookSpine } from "@/components/BookSpine";
import type { Book } from "@/data/books";

type ShelfProps = {
  books: Book[];
  justAdded?: string | null;
  genres?: string[];
};

type OpenBook = {
  index: number;
  rect: DOMRect;
};

function shelfWidth(books: Book[]) {
  return books.reduce((sum, book) => sum + book.width + 2, 0);
}

export function Shelf({ books, justAdded }: ShelfProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ x: number; left: number } | null>(null);
  const [open, setOpen] = useState<OpenBook | null>(null);
  const [overflowing, setOverflowing] = useState(false);
  const copies = shelfWidth(books) > 2600 ? 3 : 1;
  const renderedBooks = useMemo(() => Array.from({ length: copies }, () => books).flat(), [books, copies]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    function measure() {
      if (!rail) return;
      setOverflowing(rail.scrollWidth > rail.clientWidth + 6);
      if (copies === 3 && rail.scrollLeft < 10) rail.scrollLeft = rail.scrollWidth / 3;
      updatePerspective();
    }

    function updatePerspective() {
      if (!rail) return;
      const center = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      rail.querySelectorAll<HTMLElement>(".book-hit").forEach((node) => {
        const rect = node.getBoundingClientRect();
        const distance = (rect.left + rect.width / 2 - center) / (rail.clientWidth / 2);
        const eased = Math.sign(distance) * Math.pow(Math.min(Math.abs(distance), 1), 1.35);
        node.style.setProperty("--ry", `${eased * -34}deg`);
      });

      if (copies === 3) {
        const segment = rail.scrollWidth / 3;
        if (rail.scrollLeft < segment * 0.45) rail.scrollLeft += segment;
        if (rail.scrollLeft > segment * 1.55) rail.scrollLeft -= segment;
      }
    }

    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    measure();
    rail.addEventListener("scroll", updatePerspective, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", updatePerspective);
    };
  }, [books, copies]);

  useEffect(() => {
    if (!justAdded) return;
    const node = railRef.current?.querySelector<HTMLElement>(`[data-book-id="${CSS.escape(justAdded)}"]`);
    node?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [justAdded]);

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!railRef.current || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    event.preventDefault();
    railRef.current.scrollLeft += event.deltaY;
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!railRef.current) return;
    dragging.current = { x: event.clientX, left: railRef.current.scrollLeft };
    railRef.current.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!railRef.current || !dragging.current) return;
    railRef.current.scrollLeft = dragging.current.left - (event.clientX - dragging.current.x);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = null;
    railRef.current?.releasePointerCapture(event.pointerId);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!railRef.current || open) return;
    if (event.key === "ArrowLeft") railRef.current.scrollBy({ left: -320, behavior: "smooth" });
    if (event.key === "ArrowRight") railRef.current.scrollBy({ left: 320, behavior: "smooth" });
  }

  function openAt(renderedIndex: number, rect: DOMRect) {
    setOpen({ index: renderedIndex % books.length, rect });
  }

  function move(delta: number) {
    setOpen((current) => {
      if (!current) return current;
      return { ...current, index: (current.index + delta + books.length) % books.length };
    });
  }

  return (
    <section className="shelf-wrap">
      <div className={overflowing ? "edge-fade left visible" : "edge-fade left"} aria-hidden="true" />
      <div className={overflowing ? "edge-fade right visible" : "edge-fade right"} aria-hidden="true" />
      <div
        ref={railRef}
        className={overflowing ? "shelf-rail no-scrollbar" : "shelf-rail centered no-scrollbar"}
        tabIndex={0}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          dragging.current = null;
        }}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className="book-row">
          {renderedBooks.map((book, index) => (
            <span data-book-id={book.id} key={`${book.id}-${index}`}>
              <BookSpine
                book={book}
                active={open?.index === index % books.length}
                shelveIn={book.id === justAdded}
                onOpen={(rect) => openAt(index, rect)}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="shelf-line" aria-hidden="true" />
      <div className="shelf-shadow" aria-hidden="true" />
      {open && books[open.index] && (
        <BookDetail book={books[open.index]} rect={open.rect} onClose={() => setOpen(null)} onPrev={() => move(-1)} onNext={() => move(1)} />
      )}
    </section>
  );
}
