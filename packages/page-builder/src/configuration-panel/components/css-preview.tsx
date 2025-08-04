import { useI18n } from "@vivid/i18n";
import React, { useMemo } from "react";
import { renderStylesToCSS } from "../../style/css-renderer";
import { BaseStyleDictionary, StyleDictionary } from "../../style/types";
import { DefaultCSSProperties, StyleValue } from "../../style/css-renderer";

interface CSSPreviewProps<T extends BaseStyleDictionary> {
  availableStyles: StyleDictionary<T>;
  styles: StyleValue<T>;
  defaultProperties?: DefaultCSSProperties<T>;
}

export const CSSPreview = <T extends BaseStyleDictionary>({
  availableStyles,
  styles,
  defaultProperties,
}: CSSPreviewProps<T>) => {
  const t = useI18n("builder");

  const css = useMemo(() => {
    return renderStylesToCSS(availableStyles, styles, defaultProperties);
  }, [availableStyles, styles, defaultProperties]);

  return (
    <div className="mt-4 p-4 bg-secondary rounded-md">
      <h3 className="text-sm font-medium mb-2">
        {t("pageBuilder.styles.generatedCSS")}
      </h3>
      <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-40">
        {css}
      </pre>
    </div>
  );
};
