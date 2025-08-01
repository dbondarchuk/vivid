import { BuilderKeys, useI18n } from "@vivid/i18n";
import { Button, Label } from "@vivid/ui";
import { Trash } from "lucide-react";
import React from "react";
import { z } from "zod";
import { BreakpointSelector } from "./breakpoint-selector";
import { StateSelector } from "./state-selector";
import {
  BaseStyleDictionary,
  StyleDefinition,
  StyleVariant,
} from "../../style/types";
import { parentLevelKeys, StateWithParent } from "../../style/zod";

interface StyleVariantProps<T extends BaseStyleDictionary> {
  variant: StyleVariant<T[keyof T]>;
  variantIndex: number;
  style: StyleDefinition<T[keyof T]>;
  styleName: keyof T;
  onUpdateVariant: (
    styleName: keyof T,
    variantIndex: number,
    updates: Partial<StyleVariant<T[keyof T]>>
  ) => void;
  onUpdateStyle: (
    styleName: keyof T,
    variantIndex: number,
    value: z.infer<T[keyof T]>
  ) => void;
  onDeleteVariant: (styleName: keyof T, variantIndex: number) => void;
}

export const StyleVariantComponent = <T extends BaseStyleDictionary>({
  variant,
  variantIndex,
  style,
  styleName,
  onUpdateVariant,
  onUpdateStyle,
  onDeleteVariant,
}: StyleVariantProps<T>) => {
  const t = useI18n("builder");

  const getVariantLabel = (variant: StyleVariant<T[keyof T]>) => {
    const parts = [];
    if (variant.breakpoint?.length) {
      const breakpointLabels = variant.breakpoint.map((bp) =>
        t(`pageBuilder.styles.breakpoints.${bp}`)
      );
      parts.push(
        breakpointLabels.join(t("pageBuilder.styles.breakpoints.and"))
      );
    }
    if (variant.state?.length) {
      const stateLabels = (variant.state as StateWithParent[]).map(
        (stateWithParent) => {
          const stateLabel = t(
            `pageBuilder.styles.states.${stateWithParent.state}`
          );
          const parentLevel =
            parentLevelKeys[stateWithParent.parentLevel || 0] || "self";
          const parentLabel = t(
            `pageBuilder.styles.states.parentLevels.${parentLevel}`
          );

          return parentLevel === "self"
            ? stateLabel
            : `${parentLabel}:${stateLabel}`;
        }
      );
      parts.push(stateLabels.join(", "));
    }
    return parts.length > 0 ? parts.join(" - ") : t("pageBuilder.styles.base");
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Variant header with breakpoint and state controls */}
      <div className="flex flex-col justify-between gap-2">
        <div className="flex items-center gap-1 justify-between">
          <span className="text-xs text-muted-foreground">
            {getVariantLabel(variant)}
          </span>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onDeleteVariant(styleName, variantIndex)}
          >
            <Trash />
          </Button>
        </div>
        <div className="flex items-center gap-1 justify-between">
          {/* Breakpoint selector */}
          <BreakpointSelector
            breakpoints={variant.breakpoint || []}
            onBreakpointsChange={(breakpoints) =>
              onUpdateVariant(styleName, variantIndex, {
                breakpoint: breakpoints,
              })
            }
            styleName={style.name}
            variantIndex={variantIndex}
          />

          {/* State selector */}
          <StateSelector
            states={(variant.state || []) as StateWithParent[]}
            onStatesChange={(states) =>
              onUpdateVariant(styleName, variantIndex, { state: states })
            }
            styleName={style.name}
            variantIndex={variantIndex}
          />
        </div>
      </div>

      {/* Style component */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium">
          {t(`pageBuilder.styles.properties.${style.name}` as BuilderKeys)}
        </Label>
        <style.component
          value={variant.value}
          onChange={(value) => onUpdateStyle(styleName, variantIndex, value)}
        />
      </div>
    </div>
  );
};
