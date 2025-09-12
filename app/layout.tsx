import type { Metadata } from "next";
import { Dancing_Script, Poppins, Playfair_Display, Birthstone } from "next/font/google";
import "./globals.css";

const birthstone = Birthstone({
  variable: "--font-birthstone",
  subsets: ["latin"],
  weight: ["400"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Salon Supreme | Premium Hair Salon | Expert Styling",
  description: "Salon Supreme - Premier hair salon specializing in cuts, colors, styling, and treatments. Luxury hair care for the modern woman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💫</text></svg>" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body
        className={`${birthstone.variable} ${dancingScript.variable} ${poppins.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
