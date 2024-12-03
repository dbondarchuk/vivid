export type Page = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  published?: boolean;
  publishDate: Date;
  tags?: string[];
  doNotCombine?: {
    title?: boolean;
    description?: boolean;
    keywords?: boolean;
  };
  fullWidth?: boolean;
};

export type PageUpdate = Omit<Page, "_id" | "updatedAt" | "createdAt">;
export type PageCreate = Omit<Page, "_id" | "updatedAt" | "createdAt">;
