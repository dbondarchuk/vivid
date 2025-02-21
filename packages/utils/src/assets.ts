import mimeType from "mime-type/with-db";

export const mimeTypeToExtension = (fileType: string) =>
  (mimeType.extension(fileType) || "bin") as string;
