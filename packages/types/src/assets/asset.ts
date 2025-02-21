export type Asset = {
  _id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  description?: string;
  appointmentId?: string;
};

export type AssetUpdate = Omit<
  Asset,
  "_id" | "filename" | "mimeType" | "uploadedAt" | "size"
>;

export type UploadedFile = Asset & {
  url: string;
};
