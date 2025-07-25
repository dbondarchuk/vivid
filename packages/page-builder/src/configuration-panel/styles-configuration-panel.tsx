import { BuilderKeys, useI18n } from "@vivid/i18n";
import React, { useState } from "react";
import { z } from "zod";
import { Shortcut } from "../shortcuts/types";
import { DefaultCSSProperties, StyleValue } from "../style/css-renderer";
import {
  BaseStyleDictionary,
  StyleCategory,
  StyleDefinition,
  StyleDictionary,
  StyleVariant,
} from "../style/types";
import { CSSPreview, SearchBar, StyleCategoryComponent } from "./components";
import { Shortcuts } from "../shortcuts";
import { BaseBlockProps as BaseBlockPropsType } from "@vivid/builder";
import { BaseBlockProps } from "./components/base-block-props";

interface StylesConfigurationPanelProps<T extends BaseStyleDictionary> {
  styles: StyleValue<T>;
  onStylesChange: (styles: StyleValue<T>) => void;
  availableStyles: StyleDictionary<T>;
  defaultProperties?: DefaultCSSProperties<T>;
  shortcuts?: Shortcut<T>[];
  props?: any;
  onPropsChange?: (props: any) => void;
  base?: BaseBlockPropsType;
  onBaseChange?: (base: BaseBlockPropsType) => void;
  children?: React.ReactNode;
}

export const StylesConfigurationPanel = <T extends BaseStyleDictionary>({
  styles,
  onStylesChange,
  availableStyles,
  defaultProperties,
  shortcuts,
  props,
  onPropsChange,
  children,
  base,
  onBaseChange,
}: StylesConfigurationPanelProps<T>) => {
  const t = useI18n("builder");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to safely translate categories
  const getCategoryLabel = (category: StyleCategory) => {
    const categoryLabel =
      `pageBuilder.styles.categories.${category}` as BuilderKeys;
    return t.has(categoryLabel) ? t(categoryLabel) : category;
  };

  // Group styles by category and filter to only show categories with active styles
  const stylesByCategory = Object.values(availableStyles).reduce(
    (acc, style: StyleDefinition<T[keyof T]>) => {
      if (!acc[style.category]) {
        acc[style.category] = [];
      }
      acc[style.category].push(style);
      return acc;
    },
    {}
  ) as Record<StyleCategory, StyleDefinition<T[keyof T]>[]>;

  // Filter to only show categories that have active styles
  const activeCategories = Object.entries(stylesByCategory) as [
    StyleCategory,
    StyleDefinition<T[keyof T]>[],
  ][];

  // Filter categories by search term
  const filteredCategories = activeCategories.filter(
    ([category, categoryStyles]) => {
      if (searchTerm) {
        const categoryLabel = getCategoryLabel(category);
        return (
          categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoryStyles.some(
            (style) =>
              t(style.label).toLowerCase().includes(searchTerm.toLowerCase()) ||
              style.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      return true;
    }
  );

  const addStyle = (style: StyleDefinition<T[keyof T]>) => {
    const newStyles = {
      ...styles,
      [style.name]: [
        {
          breakpoint: [],
          state: [],
          value: style.defaultValue,
        },
      ],
    };
    onStylesChange(newStyles);
  };

  const updateStyle = (
    styleName: keyof T,
    variantIndex: number,
    value: z.infer<T[keyof T]>
  ) => {
    const currentVariants = styles[styleName] || [];
    const newVariants = [...currentVariants];
    newVariants[variantIndex] = {
      ...newVariants[variantIndex],
      value,
    };

    const newStyles: StyleValue<T> = {
      ...styles,
      [styleName]: newVariants,
    };
    onStylesChange(newStyles);
  };

  const deleteStyle = (styleName: keyof T) => {
    const newStyles: StyleValue<T> = { ...styles };
    delete newStyles[styleName];
    onStylesChange(newStyles);
  };

  const addVariant = (styleName: keyof T) => {
    const currentVariants = styles[styleName] || [];
    const newVariants = [
      ...currentVariants,
      {
        breakpoint: [],
        state: [],
        value: availableStyles[styleName].defaultValue,
      },
    ];

    const newStyles: StyleValue<T> = {
      ...styles,
      [styleName]: newVariants,
    };
    onStylesChange(newStyles);
  };

  const addVariantFromStyle = (
    styleDefinition: StyleDefinition<T[keyof T]>
  ) => {
    const styleName = styleDefinition.name as keyof T;
    const currentVariants = styles[styleName] || [];

    const newVariants = [
      ...currentVariants,
      {
        breakpoint: [],
        state: [],
        value: styleDefinition.defaultValue,
      },
    ];

    const newStyles: StyleValue<T> = {
      ...styles,
      [styleName]: newVariants,
    };
    onStylesChange(newStyles);
  };

  const updateVariant = (
    styleName: keyof T,
    variantIndex: number,
    updates: Partial<StyleVariant<T[keyof T]>>
  ) => {
    const currentVariants = styles[styleName] || [];
    const newVariants = [...currentVariants];
    newVariants[variantIndex] = { ...newVariants[variantIndex], ...updates };

    const newStyles: StyleValue<T> = {
      ...styles,
      [styleName]: newVariants,
    };
    onStylesChange(newStyles);
  };

  const deleteVariant = (styleName: keyof T, variantIndex: number) => {
    const currentVariants = styles[styleName] || [];
    const newVariants = [...currentVariants];
    newVariants.splice(variantIndex, 1);

    const newStyles: StyleValue<T> = {
      ...styles,
      [styleName]: newVariants,
    };
    onStylesChange(newStyles);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {children}

      {/* Base */}
      {!!onBaseChange && (
        <BaseBlockProps base={base || {}} onBaseChange={onBaseChange} />
      )}

      {/* Shortcuts */}
      {shortcuts && shortcuts.length > 0 && (
        <Shortcuts
          shortcuts={shortcuts}
          styles={styles}
          onStylesChange={onStylesChange}
          props={props}
          onPropsChange={onPropsChange}
        />
      )}

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        availableStyles={availableStyles}
        onAddStyle={addStyle}
      />

      {/* Categories */}
      {filteredCategories.map(([category, categoryStyles]) => (
        <StyleCategoryComponent
          key={category}
          category={category}
          categoryStyles={categoryStyles}
          styles={styles}
          availableStyles={availableStyles}
          searchTerm={searchTerm}
          onAddVariant={addVariant}
          onAddVariantFromStyle={addVariantFromStyle}
          onUpdateVariant={updateVariant}
          onUpdateStyle={updateStyle}
          onDeleteVariant={deleteVariant}
        />
      ))}

      {/* CSS Preview */}
      <CSSPreview
        availableStyles={availableStyles}
        styles={styles}
        defaultProperties={defaultProperties}
      />
    </div>
  );
};
