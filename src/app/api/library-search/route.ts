import { NextResponse } from "next/server";
import { books } from "@/data/books";

export const dynamic = "force-static";

function simpleSearch(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return books
    .map((book) => {
      const haystack = [book.title, book.author, book.year, book.blurb, ...(book.genres ?? [])].join(" ").toLowerCase();
      const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
      return { id: book.id, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((item) => item.id);
}

export async function POST(request: Request) {
  const { query } = (await request.json().catch(() => ({}))) as { query?: string };
  const trimmed = query?.trim() ?? "";
  if (trimmed.length < 2) return NextResponse.json({ ids: [] });

  const key = process.env.LOVABLE_API_KEY ?? process.env.OPENAI_API_KEY;
  const endpoint = process.env.LOVABLE_API_KEY
    ? "https://ai.gateway.lovable.dev/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = process.env.LOVABLE_API_KEY ? "google/gemini-2.5-flash" : "gpt-4o-mini";

  if (!key || books.length === 0) return NextResponse.json({ ids: simpleSearch(trimmed) });

  const catalogue = books
    .map((book) => `${book.id} :: ${book.title} :: ${book.author} :: ${book.year} :: ${(book.genres ?? []).join(", ")} :: ${book.blurb.slice(0, 160)}`)
    .join("\n");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Match the reader request against the catalogue. Return ONLY JSON shaped like {"ids":["id1","id2"]}, best match first, at most 20. Use an empty array if nothing fits.',
          },
          { role: "user", content: `Request: ${trimmed}\n\nCatalogue:\n${catalogue}` },
        ],
      }),
    });

    if (response.status === 429) return NextResponse.json({ error: "Too many searches. Try again in a moment." }, { status: 429 });
    if (response.status === 402) return NextResponse.json({ error: "Search credits exhausted." }, { status: 402 });
    if (!response.ok) throw new Error("Search model unavailable.");

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content ?? "{\"ids\":[]}";
    const parsed = JSON.parse(content) as { ids?: string[] };
    const valid = new Set(books.map((book) => book.id));
    return NextResponse.json({ ids: (parsed.ids ?? []).filter((id) => valid.has(id)).slice(0, 20) });
  } catch {
    return NextResponse.json({ ids: simpleSearch(trimmed) });
  }
}
