import { Footer } from "@/components/web/footer/Footer";
import { Header } from "@/components/web/header/Header";
import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "../globals.css";
import { TwLoad } from "../twLoad";
import { Toaster } from "@/components/ui/toaster";
import { Services } from "@/lib/services";
import { Script } from "@/types";
import NextScript from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const ScriptRenderer = ({
  script,
  id,
}: {
  script: Script;
  id: string | number;
}) => {
  switch (script.type) {
    case "inline":
      return <NextScript id={id.toString()}>{script.value}</NextScript>;
    case "remote":
      return <NextScript src={script.url}></NextScript>;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { headerScripts, footerScripts } =
    await Services.ConfigurationService().getConfiguration("scripts");

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfair.variable} scroll-smooth`}
    >
      {headerScripts &&
        headerScripts.map((script, index) => (
          <ScriptRenderer script={script} id={index} key={index} />
        ))}
      <TwLoad />
      <body>
        <Header />
        <main className="min-h-screen bg-white pt-20 prose-lg lg:prose-xl prose-h3:text-4xl max-w-none font-body">
          {children}
        </main>
        <Footer />
        {footerScripts &&
          footerScripts.map((script, index) => (
            <ScriptRenderer script={script} id={index} key={index} />
          ))}
        <Toaster />
      </body>
    </html>
  );
}
