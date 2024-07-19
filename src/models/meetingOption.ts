import { Fields } from "./fields";

export type MeetingOption = {
  name: string;
  slug: string;
  description: string;
  duration?: number;
  price?: number;
  fields: Fields<any>;
};
