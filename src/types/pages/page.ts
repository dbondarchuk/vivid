export type Page = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  keywords?: string;
  content: string;
  updatedAt: Date;
  published: boolean;
  doNotCombine?: {
    title?: boolean;
    description?: boolean;
    keywords?: boolean;
  };
};

export type PageUpdate = Omit<Page, "_id" | "updatedAt">;
export type PageCreate = Omit<Page, "_id" | "updatedAt">;
