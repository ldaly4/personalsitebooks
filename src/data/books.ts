export type Book = {
  id: string;
  title: string;
  author: string;
  genres?: string[];
  cover: string;
  year: number;
  blurb: string;
  rating: number;
  finished: string;
  recommender?: string;
  publisher: string;
  binding: "hardcover" | "paperback" | "mass";
  finish: "cloth" | "gloss" | "matte";
  spine: string;
  band?: string;
  ink: string;
  face: "serif" | "sans" | "mono";
  caps?: boolean;
  width: number;
  height: number;
  lean: number;
  depth: number;
  wear: number;
  spineImage?: string;
};

// Intentionally empty until the Goodreads export is provided.
// Run the import prompt from virtual_library_build_guide.md to replace this array.
export const books: Book[] = [];
