import { z } from "zod";
import { menuItemsWithSubMenuSchema } from "../configuration/styling/menu-item";
import { WithDatabaseId } from "../database";

export const pageHeaderShadowType = ["none", "static", "on-scroll"] as const;

export const pageHeaderSchema = z.object({
  name: z
    .string({ required_error: "page.headers.name.required" })
    .min(2, "page.headers.name.min"),
  menu: menuItemsWithSubMenuSchema,
  showLogo: z.coerce.boolean().default(false).optional(),
  sticky: z.coerce.boolean().default(false).optional(),
  shadow: z.enum(pageHeaderShadowType).optional(),
});

export const getPageHeaderSchemaWithUniqueNameCheck = (
  uniqueNameCheckFn: (name: string, id?: string) => Promise<boolean>,
  message: string,
) => {
  return z.object({
    ...pageHeaderSchema.shape,
    name: pageHeaderSchema.shape.name.refine(uniqueNameCheckFn, { message }),
  });
};

export type PageHeaderUpdateModel = z.infer<typeof pageHeaderSchema>;

export type PageHeader = WithDatabaseId<PageHeaderUpdateModel> & {
  updatedAt: Date;
};

export type PageHeaderListModel = Omit<PageHeader, "menu"> & {
  usedCount: number;
};
