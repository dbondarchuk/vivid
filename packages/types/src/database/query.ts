export type SortOption = {
  key: string;
  desc?: boolean;
};

export type Sort = SortOption[];

export type Query = {
  search?: string;
  limit?: number;
  offset?: number;
  sort?: Sort;
};
