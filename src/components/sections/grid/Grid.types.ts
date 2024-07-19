import { Section } from "@/types/section";

export type Row = {
  title?: string;
  className?: string;
  basis?: string;
  gap?: string | number;
  columns: Section[];
};

export type GridSection = Section & {
  title?: string;
  rows: Row[];
  gap?: string | number;
};
