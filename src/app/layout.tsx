import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haven Catalog Discovery",
  description: "A premium product discovery experience for a home goods catalog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
