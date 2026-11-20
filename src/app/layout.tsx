import type { Metadata } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import { ClientProviders } from "@/main/client-providers";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Nexo Assist",
    template: "%s · Nexo Assist",
  },
  description: "Service desk de TI da Nexo: resolva seu problema em uma conversa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${schibstedGrotesk.variable} ${newsreader.variable} h-full`}>
      <body className="min-h-full">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
