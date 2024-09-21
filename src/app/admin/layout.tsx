import Providers from "@/components/admin/layout/providers";
import { Toaster } from "@/components/ui/toaster";
// import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "../globals.css";

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
  title: "Next Shadcn",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers session={undefined}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
