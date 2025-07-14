import { BuilderKeys, useI18n } from "@vivid/i18n";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@vivid/ui";
import { Plus, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@vivid/ui";
import { z } from "zod";
import { StyleVariantComponent } from "./style-variant";
import {
  BaseStyleDictionary,
  StyleDefinition,
  StyleVariant,
} from "../../style/types";

interface StyleCategoryStyleProps<T extends BaseStyleDictionary> {
  style: StyleDefinition<T[keyof T]>;
  styleVariants: StyleVariant<T[keyof T]>[];
  searchTerm?: string;
  onAddVariant: (styleName: keyof T) => void;
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

export const StyleCategoryStyle = <T extends BaseStyleDictionary>({
  style,
  styleVariants,
  searchTerm,
  onAddVariant,
  onUpdateVariant,
  onUpdateStyle,
  onDeleteVariant,
}: StyleCategoryStyleProps<T>) => {
  const t = useI18n("builder");
  const [isStyleOpen, setIsStyleOpen] = useState(searchTerm ? true : false);
  React.useEffect(() => {
    if (searchTerm) {
      setIsStyleOpen(true);
    } else {
      setIsStyleOpen(false);
    }
  }, [searchTerm]);

  // Helper function to format style value for display
  const formatStyleValue = (value: any): string => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "object" && value !== null) {
      if (value.value !== undefined) {
        const unit = value.unit ? ` ${value.unit}` : "";
        return `${value.value}${unit}`;
      }
      if (value.x !== undefined && value.y !== undefined) {
        return `${value.x}%, ${value.y}%`;
      }
      return JSON.stringify(value);
    }
    return "—";
  };

  return (
    <Collapsible open={isStyleOpen} onOpenChange={setIsStyleOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <div className="flex items-center gap-2">
          <ChevronRight
            className={cn(
              "size-3 transition-transform",
              isStyleOpen && "rotate-90"
            )}
          />
          <style.icon className="size-4" />
          <span className="text-left">{t(style.label)}</span>
          {/* {!isStyleOpen && styleVariants.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({formatStyleValue(styleVariants[0].value)})
            </span>
          )} */}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onAddVariant(style.name as keyof T);
            }}
          >
            <Plus size={14} />
          </Button>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 pt-2 pl-2">
        {/* Style variants */}
        {styleVariants.map((variant, variantIndex) => (
          <StyleVariantComponent
            key={variantIndex}
            variant={variant}
            variantIndex={variantIndex}
            style={style}
            styleName={style.name as keyof T}
            onUpdateVariant={onUpdateVariant}
            onUpdateStyle={onUpdateStyle}
            onDeleteVariant={onDeleteVariant}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
