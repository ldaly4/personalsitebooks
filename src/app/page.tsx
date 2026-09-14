"use client";

import { useMemo, useState } from "react";
import { LibraryFilter } from "@/components/LibraryFilter";
import { RecommendBookDialog } from "@/components/RecommendBookDialog";
import { Shelf } from "@/components/Shelf";
import { TypedTitle } from "@/components/TypedTitle";
import { books, type Book } from "@/data/books";

export default function Home() {
  const [shown, setShown] = useState<Book[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const visibleBooks = shown ?? books;
  const filteredCount = visibleBooks.length;
  const recommendationGenres = useMemo(
    () => Array.from(new Set(recommendations.flatMap((book) => book.genres ?? []))),
    [recommendations],
  );

  function addRecommendation(book: Book) {
    setRecommendations((current) => [book, ...current]);
    setJustAdded(book.id);
    window.setTimeout(() => setJustAdded(null), 1400);
  }

  return (
    <main className="library-page grain">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <section className="library-shell" aria-label="Virtual library">
        <header className="library-header">
          <div className="library-kicker">A personal archive</div>
          <div className="title-row">
            <TypedTitle />
            <div className="volume-count">
              <span>{filteredCount}</span>
              <small>{filteredCount === 1 ? "volume" : "volumes"}</small>
            </div>
          </div>

          <div className="library-actions">
            <LibraryFilter books={books} onChange={setShown} />
            <button className="recommend-trigger" type="button" onClick={() => setDialogOpen(true)}>
              <span aria-hidden="true">+</span>
              Recommend a book
            </button>
          </div>
        </header>

        {visibleBooks.length > 0 ? (
          <Shelf books={visibleBooks} />
        ) : (
          <section className="empty-shelf" aria-label="Empty shelf">
            <div className="empty-rail" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} style={{ "--h": `${52 + (index % 5) * 8}px` } as React.CSSProperties} />
              ))}
            </div>
            <div>
              <p className="mono-label">Shelf waiting</p>
              <h2>Your Goodreads export is needed to place the real books.</h2>
              <p>
                Add <code>goodreads_library_export.csv</code> to the project and I can regenerate the library data with real covers,
                colors, ratings, and finished dates.
              </p>
            </div>
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="recommendation-section" aria-label="Recommended to me">
            <div className="recommendation-heading">
              <p className="mono-label">Recommended to me</p>
              <span>{recommendations.length} shelved</span>
            </div>
            <Shelf books={recommendations} justAdded={justAdded} genres={recommendationGenres} />
          </section>
        )}
      </section>

      <RecommendBookDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onRecommend={addRecommendation} />
    </main>
  );
}
