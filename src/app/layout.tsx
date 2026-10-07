import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perfum Luxury",
  description:
    "Perfumería de diseñador, árabe y de nicho. Fragancias 100% originales con precios en ARS y USD.",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  // Permite usar el área de la muesca y la barra de gestos (safe-area) en celulares.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
