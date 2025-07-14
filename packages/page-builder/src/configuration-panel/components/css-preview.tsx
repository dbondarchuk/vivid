import { useI18n } from "@vivid/i18n";
import React from "react";
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

  // Import the renderStylesToCSS function dynamically to avoid circular dependencies
  const { renderStylesToCSS } = require("../../style/css-renderer");

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <h3 className="text-sm font-medium mb-2">
        {t("pageBuilder.styles.generatedCSS")}
      </h3>
      <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
        {renderStylesToCSS(availableStyles, styles, defaultProperties)}
      </pre>
    </div>
  );
};
