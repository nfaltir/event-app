import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Fredoka, Nunito, Caveat } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "Draw your Secret Santa — one name, just for you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunito.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-(family-name:--font-body)">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}