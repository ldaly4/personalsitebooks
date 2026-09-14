import type { Book } from "@/data/books";

export type OpenLibraryResult = {
  key: string;
  title: string;
  author: string;
  year: number;
  cover: string;
  pages: number;
  publisher: string;
};

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  number_of_pages_median?: number;
  publisher?: string[];
};

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(items: T[], seed: number) {
  return items[seed % items.length];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fallbackPalette(seed: number) {
  const hue = seed % 360;
  return {
    spine: `hsl(${hue} 34% 32%)`,
    band: `hsl(${(hue + 42) % 360} 48% 48%)`,
    ink: "#faf7f0",
  };
}

export async function searchBooks(q: string, signal?: AbortSignal): Promise<OpenLibraryResult[]> {
  const params = new URLSearchParams({
    q,
    limit: "12",
    fields: "key,title,author_name,first_publish_year,cover_i,number_of_pages_median,publisher",
  });
  const response = await fetch(`https://openlibrary.org/search.json?${params}`, { signal });
  if (!response.ok) throw new Error("Open Library search failed.");
  const data = (await response.json()) as { docs?: OpenLibraryDoc[] };

  return (data.docs ?? [])
    .filter((doc) => doc.title && doc.cover_i)
    .map((doc) => ({
      key: doc.key ?? doc.title ?? crypto.randomUUID(),
      title: doc.title ?? "Untitled",
      author: doc.author_name?.[0] ?? "Unknown author",
      year: doc.first_publish_year ?? 0,
      cover: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
      pages: doc.number_of_pages_median ?? 320,
      publisher: doc.publisher?.[0] ?? "",
    }));
}

export async function readCoverPalette(src: string): Promise<{ spine: string; band: string; ink: string }> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";
  image.src = src;
  await image.decode();

  const canvas = document.createElement("canvas");
  const width = 80;
  const height = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * width));
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("No canvas context.");
  context.drawImage(image, 0, 0, width, height);

  const data = context.getImageData(0, 0, width, height).data;
  const edgeW = Math.max(1, Math.round(width * 0.06));
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  let best = { score: -1, r: 120, g: 90, b: 70 };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const pr = data[index];
      const pg = data[index + 1];
      const pb = data[index + 2];
      const max = Math.max(pr, pg, pb);
      const min = Math.min(pr, pg, pb);
      const lum = (0.2126 * pr + 0.7152 * pg + 0.0722 * pb) / 255;
      const saturation = max === 0 ? 0 : (max - min) / max;
      const score = saturation - Math.abs(lum - 0.52);
      if (score > best.score) best = { score, r: pr, g: pg, b: pb };
      if (x < edgeW) {
        r += pr;
        g += pg;
        b += pb;
        count += 1;
      }
    }
  }

  const spine = `rgb(${Math.round(r / count)} ${Math.round(g / count)} ${Math.round(b / count)})`;
  const band = `rgb(${best.r} ${best.g} ${best.b})`;
  const lum = (0.2126 * (r / count) + 0.7152 * (g / count) + 0.0722 * (b / count)) / 255;
  return { spine, band, ink: lum > 0.55 ? "#241f19" : "#faf7f0" };
}

export async function buildBook(result: OpenLibraryResult, recommender: string, note: string): Promise<Book> {
  const seed = hash(result.key);
  const pages = result.pages || 320;
  const binding: Book["binding"] = pages > 420 ? "hardcover" : pages < 260 ? "mass" : "paperback";
  const finish: Book["finish"] = binding === "hardcover" ? "cloth" : seed % 2 ? "gloss" : "matte";
  const palette = result.cover ? await readCoverPalette(result.cover).catch(() => fallbackPalette(seed)) : fallbackPalette(seed);
  const baseHeight = binding === "hardcover" ? 236 : binding === "mass" ? 196 : 214;
  const jitter = seed % 18;

  return {
    id: `rec-${result.key.replaceAll("/", "-")}-${Date.now()}`,
    title: result.title,
    author: result.author,
    genres: ["Fiction"],
    cover: result.cover,
    year: result.year,
    blurb: note || "A visitor recommendation from Open Library.",
    rating: 0,
    finished: `Recommended by ${recommender}`,
    recommender,
    publisher: result.publisher,
    binding,
    finish,
    spine: palette.spine,
    band: palette.band,
    ink: palette.ink,
    face: pick(["serif", "sans", "mono"] as const, seed),
    caps: seed % 5 === 0,
    width: Math.round(clamp(pages * 0.055 + (seed % 8) - 3, 16, 58)),
    height: baseHeight + jitter,
    lean: -5 + (seed % 6),
    depth: -7 + (seed % 15),
    wear: ((seed % 35) / 100),
  };
}
