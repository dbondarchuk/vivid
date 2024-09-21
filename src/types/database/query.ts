export type Query = {
  search?: string;
  limit?: number;
  offset?: number;
  sort?: {
    key: string;
    desc?: boolean;
  }[];
};
