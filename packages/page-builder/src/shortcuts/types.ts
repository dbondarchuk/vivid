import { BuilderKeys } from "@vivid/i18n";
import { z } from "zod";
import { RawNumberInputWithUnitsProps } from "../style-inputs/base/raw-number-input-with-units";
import { BaseStyleDictionary } from "../style/types";

type ShortcutTargetValue<T extends BaseStyleDictionary, K extends keyof T> =
  | z.infer<T[K]>
  | ((prev: z.infer<T[K]> | undefined) => z.infer<T[K]>);

export interface ShortcutOption<T extends BaseStyleDictionary> {
  label: BuilderKeys;
  labelStyle?: React.CSSProperties;
  value: string;
  targetStyles: {
    [K in keyof T]?: ShortcutTargetValue<T, K>;
  };
}

export type ShortcutInputType =
  | "combobox"
  | "radio"
  | "toggle"
  | "number-with-unit"
  | "button-group"
  | "asset-selector"
  | "color";

// Base shortcut interface without specific configs
export interface BaseShortcut<T extends BaseStyleDictionary> {
  label: BuilderKeys;
  icon: (props: { className?: string }) => React.ReactNode;
}

// Conditional types for different input types
export type ShortcutWithCombobox<T extends BaseStyleDictionary> =
  BaseShortcut<T> & {
    inputType?: "combobox";
    options: ShortcutOption<T>[];
  };

export type ShortcutWithRadio<T extends BaseStyleDictionary> =
  BaseShortcut<T> & {
    inputType: "radio";
    options: ShortcutOption<T>[];
  };

export type ShortcutWithToggle<T extends BaseStyleDictionary> =
  BaseShortcut<T> & {
    inputType: "toggle";
    options: [ShortcutOption<T>, ShortcutOption<T>];
  };

export type ShortcutWithNumberWithUnit<T extends BaseStyleDictionary> =
  BaseShortcut<T> & {
    inputType: "number-with-unit";
    targetStyle: keyof T; // Required singular target style
    numberWithUnitConfig?: Partial<
      Pick<
        RawNumberInputWithUnitsProps,
        "min" | "max" | "step" | "options" | "forceUnit"
      >
    >;
  };

export type ShortcutWithButtonGroup<T extends BaseStyleDictionary> =
  BaseShortcut<T> & {
    inputType: "button-group";
    options: ShortcutOption<T>[];
    buttonGroupConfig: {
      variant?: "default" | "outline" | "ghost";
      size?: "sm" | "default" | "lg";
    };
  };

type StyleValueAccessors<
  T extends BaseStyleDictionary,
  TStyle extends keyof T,
> = {
  get: (value: z.infer<T[TStyle]> | null | undefined) => string | null;
  set: {
    [K in keyof T]?: (
      value: string,
      prev: z.infer<T[K]> | null | undefined
    ) => z.infer<T[K]>;
  };
};

export type ShortcutWithAssetSelector<
  T extends BaseStyleDictionary,
  TStyle extends keyof T = keyof T,
> = BaseShortcut<T> & {
  inputType: "asset-selector";
  targetStyle: TStyle; // Required singular target style
  styleValue?: {
    get: (value: z.infer<T[TStyle]> | null | undefined) => string | null;
    set: {
      [K in keyof T]?: (
        value: string,
        prev: z.infer<T[K]> | null | undefined
      ) => z.infer<T[K]>;
    };
  };
  assetSelectorConfig?: {
    accept?: string;
    fullUrl?: boolean;
    placeholder?: string;
  };
};

export type ShortcutWithColor<T extends BaseStyleDictionary> =
  BaseShortcut<T> & {
    inputType: "color";
    targetStyle: keyof T; // Required singular target style
  };

// Union type for all shortcut variants
export type Shortcut<T extends BaseStyleDictionary> =
  | ShortcutWithCombobox<T>
  | ShortcutWithRadio<T>
  | ShortcutWithToggle<T>
  | ShortcutWithNumberWithUnit<T>
  | ShortcutWithButtonGroup<T>
  | ShortcutWithAssetSelector<T>
  | ShortcutWithColor<T>;
