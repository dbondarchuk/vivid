import { z } from "zod";
import { WithDatabaseId } from "../database";

export const pageTagSchema = z
  .string()
  .min(3, "Tag should be at least 3 characters long");

export const pageSchema = z.object({
  title: z.string().min(2, "Page title must be at least 2 characters"),
  content: z.string().min(1, "Page content must be at least 1 character"),
  slug: z
    .string()
    .min(1, { message: "Page slug must be at least 1 character" })
    .regex(
      /^[a-z0-9]+(?:[-\/][a-z0-9]+)*$/g,
      "Page slug must contain only latin lower case letters, digits, slash, and hyphens"
    ),
  description: z.string().min(1, "Page description is required"),
  keywords: z.string().min(1, "Page keywords are requried"),
  published: z.coerce.boolean().default(false),
  publishDate: z.date({ required_error: "Publish date is required" }),
  tags: z.array(pageTagSchema).optional(),
  doNotCombine: z
    .object({
      title: z.coerce.boolean().optional(),
      description: z.coerce.boolean().optional(),
      keywords: z.coerce.boolean().optional(),
    })
    .optional(),
  fullWidth: z.coerce.boolean().optional(),
});

export const getPageSchemaWithUniqueCheck = (
  uniqueSlugCheckFn: (name: string, id?: string) => Promise<boolean>,
  message: string
) => {
  return z.object({
    ...pageSchema.shape,
    slug: pageSchema.shape.slug.refine(uniqueSlugCheckFn, { message }),
  });
};

export type PageUpdateModel = z.infer<typeof pageSchema>;

export type Page = WithDatabaseId<PageUpdateModel> & {
  createdAt: Date;
  updatedAt: Date;
};
