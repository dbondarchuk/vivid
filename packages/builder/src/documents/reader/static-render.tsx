import { Reader, TReaderProps } from "./block";
import { BaseZodDictionary } from "../types";

export async function renderToStaticMarkup<T extends BaseZodDictionary>(
  props: TReaderProps<T>
) {
  const { renderToStaticMarkup: baseRenderToStaticMarkup } = await import(
    "react-dom/server"
  );

  const element = (
    <html>
      <body>
        <Reader {...props} />
      </body>
    </html>
  );

  return "<!DOCTYPE html>" + baseRenderToStaticMarkup(element);
}
