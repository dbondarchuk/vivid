export type Asset = {
  _id: string;
  filename: string;
  uploadedAt: Date;
  description?: string;
};

export type AssetUpdate = Omit<Asset, "_id" | "filename" | "uploadedAt">;
