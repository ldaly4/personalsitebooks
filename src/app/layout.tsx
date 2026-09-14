import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your virtual library",
  description: "A personal website arranged as a warm, tactile virtual bookshelf.",
  openGraph: {
    title: "Your virtual library",
    description: "A personal website arranged as a warm, tactile virtual bookshelf.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your virtual library",
    description: "A personal website arranged as a warm, tactile virtual bookshelf.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Karla:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
