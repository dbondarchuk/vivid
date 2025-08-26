import { useI18n } from "@vivid/i18n";
import React, { useMemo } from "react";
import { renderStylesToCSS } from "../../style/css-renderer";
import { BaseStyleDictionary, StyleDictionary } from "../../style/types";
import { DefaultCSSProperties, StyleValue } from "../../style/css-renderer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@vivid/ui";
import { Bug } from "lucide-react";

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
    <Collapsible className="mt-4 p-4 bg-secondary rounded-md">
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
        <Bug className="size-4" /> {t("pageBuilder.styles.generatedCSS")}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <pre className="text-xs bg-background mt-2 p-2 rounded border overflow-auto max-h-40">
          {css}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
};
