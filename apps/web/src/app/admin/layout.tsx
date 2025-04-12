import Providers from "@/components/admin/layout/providers";
import { SonnerToaster, Toaster } from "@vivid/ui";
import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "VIVID CMS",
  description: "Manage your website from here",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${playfair.variable} ${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers session={undefined}>
          <Toaster />
          <SonnerToaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
