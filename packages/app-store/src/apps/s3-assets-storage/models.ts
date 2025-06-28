import { z } from "zod";

export const s3ConfigurationSchema = z.object({
  region: z.string().min(1, "s3AssetsStorage.form.region.required"),
  accessKeyId: z.string().min(1, "s3AssetsStorage.form.accessKeyId.required"),
  secretAccessKey: z
    .string()
    .min(1, "s3AssetsStorage.form.secretAccessKey.required"),
  endpoint: z.string().url("s3AssetsStorage.form.endpoint.url").optional(),
  bucket: z.string().optional(),
  forcePathStyle: z.coerce.boolean().optional(),
});

export type S3Configuration = z.infer<typeof s3ConfigurationSchema>;
