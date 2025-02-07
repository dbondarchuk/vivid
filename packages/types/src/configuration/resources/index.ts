import { z } from "zod";

export const inlineResourceType = "inline" as const;
export const remoteResourceType = "remote" as const;

export const resourceSourceTypeLabels = {
  [inlineResourceType]: "Inline",
  [remoteResourceType]: "Remote",
};

export const resourceSourceType = z.enum(
  [inlineResourceType, remoteResourceType],
  { message: "Unknow resource source type" }
);

export const inlineResourceSchema = z.object({
  source: resourceSourceType.extract(["inline"]),
  value: z.string().min(1, "Resource value is required"),
});

export const remoteResourceSchema = z.object({
  source: resourceSourceType.extract(["remote"]),
  url: z.string().url("Must be a valid url"),
});

export const resourceSchema = z.discriminatedUnion("source", [
  inlineResourceSchema,
  remoteResourceSchema,
]);

export type RemoteResource = z.infer<typeof remoteResourceSchema>;
export type InlineResource = z.infer<typeof inlineResourceSchema>;

export type Resource = z.infer<typeof resourceSchema>;
