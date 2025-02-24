import React from "react";
import { TReaderDocument } from "./core";
import { Reader } from "./block";

type TOptions = {
  rootBlockId?: string;
  args?: Record<string, any>;
};

export async function renderToStaticMarkup(
  document: TReaderDocument,
  { rootBlockId = "root", args }: TOptions
) {
  const { renderToStaticMarkup: baseRenderToStaticMarkup } = await import(
    "react-dom/server"
  );

  const element = (
    <html>
      <body>
        <Reader
          document={document}
          args={args || {}}
          rootBlockId={rootBlockId}
        />
      </body>
    </html>
  );

  return "<!DOCTYPE html>" + baseRenderToStaticMarkup(element);
}
