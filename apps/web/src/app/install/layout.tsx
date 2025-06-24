import Providers from "@/components/admin/layout/providers";
import { Toaster } from "@vivid/ui";
import { getI18nAsync } from "@vivid/i18n";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");

  return {
    title: t("install.layout.title"),
    description: t("install.layout.description"),
  };
}

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
