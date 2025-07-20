import { Footer } from "@/components/web/footer";
import { SonnerToaster, Toaster } from "@vivid/ui";

import { Resource } from "@vivid/types";

import NextScript from "next/script";
import { TwLoad } from "../twLoad";

import { ServicesContainer } from "@vivid/services";
import "../globals.css";
import { getColorsCss } from "@vivid/utils";
import { CookiesProvider } from "@/components/cookies-provider";
import { getLoggerFactory } from "@vivid/logger";

import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

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
  const logger = getLoggerFactory("RootLayout")("RootLayout");
  logger.debug("Starting root layout render");

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

  const locale = await getLocale();

  logger.debug(
    { hasGeneral: !!general, hasScripts: !!scripts, hasStyling: !!styling },
    "Retrieved configurations"
  );

  if (!general) {
    logger.debug("No general configuration found, returning minimal layout");
    return (
      <html>
        <body>{children}</body>
      </html>
    );
  }

  const weights = `:wght@100..900`;

  const primaryFont = styling?.fonts?.primary || "Montserrat";
  const secondaryFont = styling?.fonts?.secondary || "Playfair Display";
  const tertiaryFont = styling?.fonts?.tertiary;

  logger.debug(
    { primaryFont, secondaryFont, tertiaryFont },
    "Font configuration"
  );

  const tertiaryFontQueryArg = tertiaryFont
    ? `&family=${encodeURIComponent(tertiaryFont)}${weights}`
    : "";

  const fontsRes = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      primaryFont
    )}${weights}&family=${encodeURIComponent(
      secondaryFont
    )}${weights}${tertiaryFontQueryArg}&display=swap`,
    {
      cache: "force-cache",
    }
  );

  const fonts = await fontsRes.text();
  const colors = getColorsCss(styling?.colors);

  logger.debug(
    { fontsLength: fonts.length, hasColors: !!colors },
    "Generated styles"
  );

  return (
    <CookiesProvider>
      <html lang={locale} className="scroll-smooth">
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
            <link
              rel="icon"
              href={general.favicon}
              type="image/x-icon"
              sizes="any"
            />
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
          <NextIntlClientProvider>
            <main className="min-h-screen max-w-none">{children}</main>
            {scripts?.footer?.map((resource, index) => (
              <ScriptRenderer resource={resource} id={index} key={index} />
            ))}
            <Toaster />
            <SonnerToaster />
          </NextIntlClientProvider>
        </body>
      </html>
    </CookiesProvider>
  );
}
