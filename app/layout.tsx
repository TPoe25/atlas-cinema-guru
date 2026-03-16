import "./globals.css";
import type { Metadata } from "next";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Cinema Guru",
  description: "Track favorites and watch later titles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
