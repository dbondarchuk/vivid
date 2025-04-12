import Providers from "@/components/admin/layout/providers";
import { Toaster } from "@vivid/ui";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VIVID CMS - Install",
  description: "Installation of vivid",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden `}
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
