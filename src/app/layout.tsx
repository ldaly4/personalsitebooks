import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your virtual library",
  description: "A personal virtual bookshelf with 3D book spines, shelf search, and visitor recommendations.",
  openGraph: {
    title: "Your virtual library",
    description: "A personal virtual bookshelf with 3D book spines, shelf search, and visitor recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your virtual library",
    description: "A personal virtual bookshelf with 3D book spines, shelf search, and visitor recommendations.",
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
