"use client";

import { useEffect, useState } from "react";
import { Shelf } from "@/components/Shelf";
import { TypedTitle } from "@/components/TypedTitle";
import { sections } from "@/data/sections";

function currentSectionFromHash() {
  if (typeof window === "undefined") return null;
  const id = window.location.hash.replace(/^#/, "");
  return sections.some((section) => section.id === id) ? id : null;
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(currentSectionFromHash());

    function onHashChange() {
      setSelectedId(currentSectionFromHash());
    }

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  function selectSection(id: string | null) {
    if (id) {
      if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
      setSelectedId(id);
      return;
    }

    if (window.location.hash) window.history.pushState(null, "", window.location.pathname);
    setSelectedId(null);
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
              <span>{sections.length}</span>
              <small>sections</small>
            </div>
          </div>
          <p className="library-instruction">Choose a book to explore.</p>
        </header>

        <Shelf books={sections} selectedId={selectedId} onSelect={selectSection} />
      </section>
    </main>
  );
}
