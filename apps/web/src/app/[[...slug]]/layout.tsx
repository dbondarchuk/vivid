import { Footer } from "@/components/web/footer/footer";
import { Header } from "@/components/web/header";
import { Toaster } from "@vivid/ui";

import { Resource } from "@vivid/types";

import Color from "color";
import NextScript from "next/script";
import { TwLoad } from "../twLoad";

import { ServicesContainer } from "@vivid/services";
import "../globals.css";

const ScriptRenderer = ({
  resource,
  id,
}: {
  resource: Resource;
  id: string | number;
}) => {
  switch (resource.source) {
    case "inline":
      return <NextScript id={id.toString()}>{resource.value}</NextScript>;
    case "remote":
      return <NextScript src={resource.url}></NextScript>;
  }
};

const CssRenderer = ({
  resource,
  id,
}: {
  resource: Resource;
  id: string | number;
}) => {
  switch (resource.source) {
    case "inline":
      return <style id={id.toString()}>{resource.value}</style>;
    case "remote":
      // eslint-disable-next-line @next/next/no-css-tags
      return <link rel="stylesheet" href={resource.url} />;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const scripts = await Services.ConfigurationService().getConfiguration(
  //   "scripts"
  // );

  // const { favicon } = await Services.ConfigurationService().getConfiguration(
  //   "general"
  // );

  // const styling = await Services.ConfigurationService().getConfiguration(
  //   "styling"
  // );

  const { general, scripts, styling } =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "general",
      "scripts",
      "styling"
    );

  if (!general)
    return (
      <html>
        <body>{children}</body>
      </html>
    );

  const primaryFont = styling?.fonts?.primary || "Montserrat";
  const secondaryFont = styling?.fonts?.secondary || "Playfair Display";
  const tertiaryFont = styling?.fonts?.tertiary;

  const tertiaryFontQueryArg = tertiaryFont
    ? `&family=${encodeURIComponent(tertiaryFont)}`
    : "";

  const fontsRes = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      primaryFont
    )}&family=${encodeURIComponent(
      secondaryFont
    )}${tertiaryFontQueryArg}&display=swap`,
    {
      cache: "force-cache",
    }
  );

  const fonts = await fontsRes.text();
  const colors = (styling?.colors || [])
    .filter((color) => !!color.value)
    .map(({ type, value }) => {
      const color = Color(value).hsl().object();
      return `--${type}-color: ${color.h.toFixed(1)} ${color.s.toFixed(1)}% ${color.l.toFixed(1)}%;`;
    })
    .join("\n");

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @layer base {
              ${fonts}

              :root {
                --font-primary: '${primaryFont}';
                --font-secondary: '${secondaryFont}';
                ${tertiaryFont ? `--font-tertiary: '${tertiaryFont}';` : ""}
                ${colors}
              }
            }
          `,
          }}
        />
        {general.favicon && (
          <link rel="icon" href={general.favicon} sizes="any" />
        )}
        {scripts?.header?.map((resource, index) => (
          <ScriptRenderer resource={resource} id={index} key={index} />
        ))}
        {styling?.css?.map((resource, index) => (
          <CssRenderer resource={resource} id={index} key={index} />
        ))}
      </head>
      <TwLoad />
      <body className="font-primary">
        <Header />
        <main className="min-h-screen bg-background pt-5 prose-lg lg:prose-xl prose-h3:text-4xl max-w-none">
          {children}
        </main>
        <Footer />
        {scripts?.footer?.map((resource, index) => (
          <ScriptRenderer resource={resource} id={index} key={index} />
        ))}
        <Toaster />
      </body>
    </html>
  );
}
