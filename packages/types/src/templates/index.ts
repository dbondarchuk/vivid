import { z } from "zod";
import { communicationChannels } from "../communication";
import { WithDatabaseId } from "../database";

export const templateSchema = z.object({
  name: z.string().min(3, "Template name is required"),
  type: z.enum(communicationChannels, { message: "Unknown type" }),
  value: z.any({ message: "Template value is required" }),
});

export const getTemplateSchemaWithUniqueCheck = (
  uniqueNameCheckFn: (name: string, id?: string) => Promise<boolean> | boolean,
  message: string
) => {
  return z.object({
    ...templateSchema.shape,
    name: templateSchema.shape.name.refine(uniqueNameCheckFn, { message }),
  });
};

export type TemplateUpdateModel = z.infer<typeof templateSchema>;
export type Template = WithDatabaseId<TemplateUpdateModel> & {
  updatedAt: Date;
};

export type TemplateListModel = Omit<Template, "value">;
