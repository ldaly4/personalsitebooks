"use client";

import { useEffect, useMemo, useState } from "react";
import { buildBook, searchBooks, type OpenLibraryResult } from "@/lib/openLibrary";
import type { Book } from "@/data/books";

type RecommendBookDialogProps = {
  open: boolean;
  onClose: () => void;
  onRecommend: (book: Book) => void;
};

export function RecommendBookDialog({ open, onClose, onRecommend }: RecommendBookDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibraryResult[]>([]);
  const [picked, setPicked] = useState<OpenLibraryResult | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const canSubmit = useMemo(() => picked && name.trim().length > 0 && name.trim().length <= 60 && note.length <= 500, [name, note, picked]);

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      setStatus("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("Searching...");
      try {
        const found = await searchBooks(query.trim(), controller.signal);
        setResults(found);
        setStatus(found.length ? "" : "No covers found.");
      } catch (error) {
        if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : "Search failed.");
      }
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  if (!open) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!picked || !canSubmit) return;
    setStatus("Shelving...");
    try {
      const book = await buildBook(picked, name.trim(), note.trim());
      onRecommend(book);
      setQuery("");
      setResults([]);
      setPicked(null);
      setName("");
      setNote("");
      setStatus("");
      onClose();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not build that book.");
    }
  }

  return (
    <div className="dialog-layer" role="dialog" aria-modal="true" aria-label="Recommend a book">
      <button className="dialog-backdrop" type="button" aria-label="Close dialog" onClick={onClose} />
      <form className="recommend-dialog" onSubmit={submit}>
        <div className="dialog-top">
          <div>
            <p className="mono-label">Recommend a book</p>
            <h2>Send a volume to the shelf</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
            x
          </button>
        </div>

        <label className="field">
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or author..." />
        </label>

        {!picked && (
          <div className="result-list">
            {results.map((result) => (
              <button key={result.key} type="button" onClick={() => setPicked(result)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.cover} alt="" />
                <span>
                  <strong>{result.title}</strong>
                  <small>
                    {result.author}
                    {result.year ? `, ${result.year}` : ""}
                  </small>
                </span>
                <em>Pick</em>
              </button>
            ))}
          </div>
        )}

        {picked && (
          <div className="picked-book">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={picked.cover} alt="" />
            <div>
              <strong>{picked.title}</strong>
              <span>
                {picked.author}
                {picked.year ? `, ${picked.year}` : ""}
              </span>
              <button type="button" onClick={() => setPicked(null)}>
                Change
              </button>
            </div>
          </div>
        )}

        <div className="dialog-grid">
          <label className="field">
            <span>Your name</span>
            <input value={name} onChange={(event) => setName(event.target.value.slice(0, 60))} maxLength={60} />
          </label>
          <label className="field">
            <span>Why should I read it?</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value.slice(0, 500))} maxLength={500} />
          </label>
        </div>

        <div className="dialog-actions">
          <span>{status}</span>
          <button disabled={!canSubmit} type="submit">
            Shelve recommendation
          </button>
        </div>
      </form>
    </div>
  );
}
