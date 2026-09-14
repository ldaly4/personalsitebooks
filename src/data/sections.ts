export type SectionLink = {
  label: string;
  href: string;
};

export type SectionBlock = {
  heading: string;
  body: string;
  items?: string[];
  links?: SectionLink[];
  imageLabel?: string;
};

export type SiteSection = {
  id: string;
  title: string;
  description: string;
  coverNote: string;
  contentIntro: string;
  blocks: SectionBlock[];
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
  publisher: string;
};

export const sections: SiteSection[] = [
  {
    id: "about-me",
    title: "About Me",
    description: "Introduction, background and interests.",
    coverNote: "A beginning",
    contentIntro:
      "Placeholder: add a short introduction here, including where you are based, what you care about, and the threads that connect your work and interests.",
    blocks: [
      {
        heading: "Background",
        body: "Placeholder: describe your background in your own words. Keep this warm and specific, without turning it into a formal CV.",
        items: ["Placeholder interest or theme", "Placeholder value or curiosity", "Placeholder current focus"],
      },
      {
        heading: "What I am drawn to",
        body: "Placeholder: note the kinds of problems, communities, aesthetics or ideas you like spending time with.",
      },
    ],
    binding: "hardcover",
    finish: "cloth",
    spine: "#5c3326",
    band: "#c59a5b",
    ink: "#fff8ec",
    face: "serif",
    width: 46,
    height: 246,
    lean: -2,
    depth: -3,
    wear: 0.18,
    publisher: "LD",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Things I have built, with images, descriptions and links.",
    coverNote: "Selected work",
    contentIntro:
      "Placeholder: replace these project entries with real things you have built. Add links, images and short notes about what each project does.",
    blocks: [
      {
        heading: "Featured project",
        body: "Placeholder project description: explain the problem, your role and what changed because this exists.",
        imageLabel: "Project image placeholder",
        links: [{ label: "Add project link", href: "#" }],
      },
      {
        heading: "Another build",
        body: "Placeholder project description: add a second project, experiment or prototype.",
        imageLabel: "Project image placeholder",
      },
    ],
    binding: "paperback",
    finish: "gloss",
    spine: "#243f3a",
    band: "#d9b66c",
    ink: "#faf7f0",
    face: "sans",
    caps: true,
    width: 38,
    height: 226,
    lean: -4,
    depth: 4,
    wear: 0.11,
    publisher: "LAB",
  },
  {
    id: "work-experience",
    title: "Work & Experience",
    description: "Roles, experience and achievements.",
    coverNote: "Practice",
    contentIntro:
      "Placeholder: add your roles, experience, responsibilities and achievements here. Keep outcomes concrete once you have the details.",
    blocks: [
      {
        heading: "Current or recent role",
        body: "Placeholder: role title, organisation and timeframe. Add a concise summary of what you worked on.",
        items: ["Placeholder achievement", "Placeholder responsibility", "Placeholder collaboration"],
      },
      {
        heading: "Earlier experience",
        body: "Placeholder: add previous work, volunteering, internships or meaningful experience.",
      },
    ],
    binding: "hardcover",
    finish: "cloth",
    spine: "#4d4637",
    band: "#8fb39a",
    ink: "#faf7f0",
    face: "mono",
    width: 52,
    height: 252,
    lean: -1,
    depth: 2,
    wear: 0.23,
    publisher: "CV",
  },
  {
    id: "writing-ideas",
    title: "Writing & Ideas",
    description: "Articles, notes and things I am exploring.",
    coverNote: "Notes",
    contentIntro:
      "Placeholder: collect essays, notes, reading lists or half-formed ideas here. This section can be polished or deliberately notebook-like.",
    blocks: [
      {
        heading: "Recent notes",
        body: "Placeholder: add article titles, short abstracts or links to published writing.",
        items: ["Placeholder essay idea", "Placeholder note", "Placeholder question"],
      },
      {
        heading: "Exploring",
        body: "Placeholder: list the themes, questions or subjects you are currently thinking about.",
      },
    ],
    binding: "paperback",
    finish: "matte",
    spine: "#6b3944",
    band: "#e2bf87",
    ink: "#fff8ec",
    face: "serif",
    width: 34,
    height: 220,
    lean: -5,
    depth: -5,
    wear: 0.28,
    publisher: "TXT",
  },
  {
    id: "outside-of-work",
    title: "Outside of Work",
    description: "Hobbies and creative projects.",
    coverNote: "Elsewhere",
    contentIntro:
      "Placeholder: add the interests, rituals, hobbies and creative projects that make the rest of the site feel like you.",
    blocks: [
      {
        heading: "Creative life",
        body: "Placeholder: describe creative practices, hobbies or side projects.",
        imageLabel: "Creative project image placeholder",
      },
      {
        heading: "Small joys",
        body: "Placeholder: add a few specific things you like outside work.",
        items: ["Placeholder hobby", "Placeholder place", "Placeholder practice"],
      },
    ],
    binding: "mass",
    finish: "matte",
    spine: "#775326",
    band: "#cfc28b",
    ink: "#fff8ec",
    face: "sans",
    width: 28,
    height: 204,
    lean: -3,
    depth: 6,
    wear: 0.32,
    publisher: "ETC",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Email and social links.",
    coverNote: "Say hello",
    contentIntro: "Placeholder: add the best ways to reach you. Replace or remove any links that do not apply.",
    blocks: [
      {
        heading: "Get in touch",
        body: "Placeholder: add your preferred contact note here.",
        links: [
          { label: "Email placeholder", href: "mailto:hello@example.com" },
          { label: "LinkedIn placeholder", href: "#" },
          { label: "GitHub placeholder", href: "https://github.com/ldaly4" },
        ],
      },
    ],
    binding: "paperback",
    finish: "gloss",
    spine: "#29324f",
    band: "#b88a67",
    ink: "#faf7f0",
    face: "mono",
    caps: true,
    width: 31,
    height: 214,
    lean: 0,
    depth: -1,
    wear: 0.15,
    publisher: "HI",
  },
];
