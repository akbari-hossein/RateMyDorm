import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateMyDorm",
  description: "Rate and review university dormitories",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <main className="mx-auto min-h-dvh max-w-lg bg-slate-950">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
