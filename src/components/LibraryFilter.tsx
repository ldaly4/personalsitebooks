"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Book } from "@/data/books";

type LibraryFilterProps = {
  books: Book[];
  onChange: (books: Book[] | null) => void;
};

export function LibraryFilter({ books, onChange }: LibraryFilterProps) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState("");
  const reqId = useRef(0);

  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    books.forEach((book) => book.genres?.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [books]);

  useEffect(() => {
    const trimmed = query.trim();
    const id = ++reqId.current;

    if (trimmed.length < 2) {
      const genreFiltered = genre === "All" ? null : books.filter((book) => book.genres?.includes(genre));
      onChange(genreFiltered);
      setStatus("");
      return;
    }

    setStatus("Reading the shelves...");
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/library-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed }),
        });
        const data = (await response.json()) as { ids?: string[]; error?: string };
        if (id !== reqId.current) return;
        if (!response.ok) throw new Error(data.error ?? "Search failed.");
        const ranked = (data.ids ?? []).map((bookId) => books.find((book) => book.id === bookId)).filter((book): book is Book => Boolean(book));
        const filtered = genre === "All" ? ranked : ranked.filter((book) => book.genres?.includes(genre));
        onChange(filtered);
        setStatus(`${filtered.length} found`);
      } catch (error) {
        if (id !== reqId.current) return;
        const fallback = books.filter((book) => {
          const haystack = [book.title, book.author, book.blurb, ...(book.genres ?? [])].join(" ").toLowerCase();
          return haystack.includes(trimmed.toLowerCase()) && (genre === "All" || book.genres?.includes(genre));
        });
        onChange(fallback);
        setStatus(error instanceof Error ? error.message : "Using simple search");
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [books, genre, onChange, query]);

  return (
    <div className="library-filter">
      <div className="search-box">
        <span aria-hidden="true">?</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" />
        <small>{status}</small>
      </div>
      <div className="genre-pills no-scrollbar" aria-label="Genre filters">
        {["All", ...genres].map((item) => (
          <button className={genre === item ? "active" : ""} key={item} type="button" onClick={() => setGenre(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
