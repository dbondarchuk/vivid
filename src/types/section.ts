import { sectionTypes } from "@/components/sections/section";

export type Section = {
  type: keyof typeof sectionTypes;
  className?: string;
  id?: string;
};
