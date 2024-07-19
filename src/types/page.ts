import { Section } from "./section";

export type Page = {
  title: string;
  description?: string;
  keywords?: string;
  sections: Section[];
};
