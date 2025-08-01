import { z } from "zod";

import { FONT_FAMILY_NAMES } from "../style-inputs/helpers/font-family";
import { COLOR_NAMES } from "./helpers/colors";

export const zColorCustom = z
  .string()
  .regex(/^(\d+)\s+([\d.]+)%\s+([\d.]+)%$/, {
    message: "pageBuilder.styleInputs.color.unknownType",
  });
export const zTransparentColor = z.literal("transparent");
const colorPresetVars = COLOR_NAMES.map((c) => `var(--value-${c}-color)`);
const [zColorPresetVarsFirst, ...zColorPresetVars] = colorPresetVars;
export const zColorPreset = z.enum(
  [zColorPresetVarsFirst, ...zColorPresetVars],
  {
    message: "pageBuilder.styleInputs.color.unknownType",
  }
);

export const zColor = z.union([zColorCustom, zColorPreset, zTransparentColor], {
  message: "pageBuilder.styleInputs.color.unknownType",
});
export const zColorNullable = zColor.optional().nullable();

export const units = ["px", "rem", "%", "vh", "vw"] as const;
export const zUnit = z.enum(units, {
  message: "pageBuilder.styleInputs.unit.unknownType",
});
export type Unit = z.infer<typeof zUnit>;

export const zFontFamily = z.enum(FONT_FAMILY_NAMES, {
  message: "pageBuilder.styleInputs.fontFamily.unknownType",
});
export type FontFamily = z.infer<typeof zFontFamily>;

export const zNumberValueWithUnit = z.object({
  value: z.coerce.number(),
  unit: zUnit,
});

export type NumberValueWithUnit = z.infer<typeof zNumberValueWithUnit>;

const globalKeywords = [
  "auto",
  "inherit",
  "initial",
  "unset",
  "revert",
] as const;

export const zNumberValueWithUnitOrGlobalKeyword = z.union([
  zNumberValueWithUnit,
  z.enum(globalKeywords),
]);

export type NumberValueWithUnitOrGlobalKeyword = z.infer<
  typeof zNumberValueWithUnitOrGlobalKeyword
>;

export const getZNumberValueWithUnitOrKeyword = <T extends string>(
  keywords: T[]
) =>
  z.union(
    [
      zNumberValueWithUnit,
      z.enum(globalKeywords),
      ...(keywords.map((k) => z.literal(k)) as [
        z.ZodLiteral<T>,
        ...z.ZodLiteral<T>[],
      ]),
    ],
    {
      message: "pageBuilder.styleInputs.unit.unknownType",
    }
  );

export type NumberValueWithUnitOrKeyword<T extends string> = z.infer<
  ReturnType<typeof getZNumberValueWithUnitOrKeyword<T>>
>;

export const zFourSideValues = z.object({
  top: zNumberValueWithUnitOrGlobalKeyword,
  bottom: zNumberValueWithUnitOrGlobalKeyword,
  right: zNumberValueWithUnitOrGlobalKeyword,
  left: zNumberValueWithUnitOrGlobalKeyword,
});

export type FourSideValues = z.infer<typeof zFourSideValues>;

export const breakpoints = [
  "sm", // >= 40rem (640px)
  "max-sm", // < 40rem (640px)
  "md", // >= 48rem (768px)
  "max-md", // < 48rem (768px)
  "lg", // >= 64rem (1024px)
  "max-lg", // < 64rem (1024px)
  "xl", // >= 80rem (1280px)
  "max-xl", // < 80rem (1280px)
  "2xl", // >= 96rem (1536px)
  "max-2xl", // < 96rem (1536px)
] as const;

// New schemas for responsive and state-based styles
export const zBreakpoint = z.enum(breakpoints);
export type Breakpoint = z.infer<typeof zBreakpoint>;

export const viewStates = ["inView", "notInView", "firstTimeInView"] as const;
export type ViewState = (typeof viewStates)[number];

export const states = [
  "hover",
  "focus",
  "active",
  "disabled",
  ...viewStates,
] as const;
export const zState = z.enum(states);
export type State = z.infer<typeof zState>;

export const isViewState = (state: State): state is ViewState =>
  viewStates.includes(state as ViewState);

export const parentLevelKeys = [
  "self",
  "parent",
  "grandparent",
  "greatGrandparent",
  "fourthParent",
  "fifthParent",
  "sixthParent",
  "seventhParent",
  "eighthParent",
  "ninthParent",
  "tenthParent",
] as const;

// Enhanced state system with parent selectors using CSS custom properties
export const zStateWithParent = z.object({
  state: zState,
  parentLevel: z.number().int().min(0).max(10).optional().default(0), // 0 = self, 1 = parent, 2 = grandparent, etc.
});

export type StateWithParent = z.infer<typeof zStateWithParent>;

// Helper function to generate CSS selector for parent states using CSS custom properties
export function generateParentStateSelector(state: StateWithParent): string {
  if (
    (state.parentLevel === 0 || !state.parentLevel) &&
    !isViewState(state.state)
  ) {
    return `:${state.state}`;
  }

  // Use CSS custom properties for parent state detection
  // This will be handled by JavaScript to set data attributes on parent elements
  return `[data-parent-${state.parentLevel}-${state.state}="true"]`;
}

// Helper function to check if a state has parent selector
export function hasParentSelector(state: StateWithParent): boolean {
  return (state.parentLevel || 0) > 0;
}

// Helper function to generate the data attribute name for parent state
export function generateParentStateDataAttribute(
  state: StateWithParent
): string {
  // if (state.parentLevel === 0 || !state.parentLevel) {
  //   return null;
  // }
  return `data-parent-${state.parentLevel}-${state.state}`;
}
