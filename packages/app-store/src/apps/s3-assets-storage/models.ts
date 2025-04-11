import { z } from "zod";

export const s3ConfigurationSchema = z.object({
  region: z.string().min(1, "S3 region is required"),
  accessKeyId: z.string().min(1, "Access key ID is required"),
  secretAccessKey: z.string().min(1, "Secret access key is required"),
  endpoint: z.string().url("Should be a valid URL").optional(),
  bucket: z.string().optional(),
  forcePathStyle: z.coerce.boolean().optional(),
});

export type S3Configuration = z.infer<typeof s3ConfigurationSchema>;
