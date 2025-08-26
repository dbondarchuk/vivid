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
  "default",
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

export const parentLevelKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const zStateTarget = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("self"),
    data: z.undefined(),
  }),
  z.object({
    type: z.literal("parent"),
    data: z.object({
      level: z.number().int().min(1).max(10),
    }),
  }),
  z.object({
    type: z.literal("selector"),
    data: z.object({
      stateType: z.enum(["block", "selector"]),
      selector: z.string(), // Only for selector type
    }),
  }),
]);

export type StateTarget = z.infer<typeof zStateTarget>;

// Enhanced state system with flexible target selection
export const zStateWithTarget = z.object({
  state: zState,
  target: zStateTarget.optional(),
});

export type StateWithTarget = z.infer<typeof zStateWithTarget>;

// Helper function to generate CSS selector for state targets
export function generateStateTargetSelector(state: StateWithTarget): string {
  const target = state.target ?? { type: "self" };
  const stateValue = state.state === "default" ? "" : `:${state.state}`;

  if (target.type === "self") {
    return isViewState(state.state)
      ? `[data-parent-0-${state.state}="true"]`
      : stateValue;
  } else if (target.type === "parent") {
    // Use CSS custom properties for parent state detection
    return `[data-parent-${target.data.level}-${state.state}="true"]`;
  } else if (target.type === "selector") {
    // For custom selectors, we'll use the selector directly
    // The state will be applied to elements matching this selector
    const statePart = `${isViewState(state.state) ? `[data-parent-0-${state.state}="true"]` : stateValue}`;
    const selectorPart = `${target.data.selector.startsWith("&") ? "" : " "}${target.data.selector.trimEnd()}`;
    return target.data.stateType === "block"
      ? `${statePart}${selectorPart}`
      : `${selectorPart}${statePart}`;
  }

  // Fallback to self state
  return stateValue;
}

export function isSelfTarget(
  state: StateWithTarget
): state is StateWithTarget & { target: { type: "self" } } {
  return !state.target || state.target.type === "self";
}

// Helper function to check if a state has a target other than self
export function isNonSelfTarget(state: StateWithTarget): boolean {
  return state.target?.type !== "self";
}

// Helper function to check if a state has parent target
export function isParentTarget(
  state: StateWithTarget
): state is StateWithTarget & { target: { type: "parent" } } {
  return state.target?.type === "parent";
}

// Helper function to check if a state has custom selector target
export function isSelectorTarget(
  state: StateWithTarget
): state is StateWithTarget & { target: { type: "selector" } } {
  return state.target?.type === "selector";
}

// Helper function to generate the data attribute name for view state
export function generateViewStateDataAttribute(
  state: StateWithTarget
): string | null {
  const level = isParentTarget(state) ? state.target?.data?.level || 0 : 0;
  return `data-parent-${level}-${state.state}`;
}

// Legacy compatibility - convert old parentLevel to new stateTarget
export function convertParentLevelToStateTarget(
  parentLevel: number
): StateTarget {
  if (parentLevel === 0) {
    return { type: "self" };
  }
  return {
    type: "parent",
    data: { level: parentLevel },
  };
}

// Legacy compatibility - convert new stateTarget to old parentLevel
export function convertStateTargetToParentLevel(
  stateTarget: StateTarget
): number {
  if (stateTarget.type === "self") {
    return 0;
  }
  if (stateTarget.type === "parent" && stateTarget.data?.level) {
    return stateTarget.data.level;
  }
  return 0; // Default to self for selector type
}
