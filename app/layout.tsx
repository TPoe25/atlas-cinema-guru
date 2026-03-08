import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cinema Guru",
  description: "Track favorites and watch later titles"
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
