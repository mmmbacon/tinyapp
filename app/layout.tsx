import type { Metadata } from "next";
import { Fugaz_One, Poppins } from "next/font/google";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "500"],
  variable: "--font-poppins",
});

const fugazOne = Fugaz_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fugaz",
});

export const metadata: Metadata = {
  title: "TinyApp",
  description: "The Tiny URL Shortener",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${fugazOne.variable}`}>
      <body className={poppins.className}>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
