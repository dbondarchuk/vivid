import { z } from "zod";

export const inlineResourceType = "inline" as const;
export const remoteResourceType = "remote" as const;

export const resourceSourceTypeLabels = {
  [inlineResourceType]: "Inline",
  [remoteResourceType]: "Remote",
};

export const resourceSourceType = z.enum(
  [inlineResourceType, remoteResourceType],
  { message: "configuration.resources.type.invalid" },
);

export const inlineResourceSchema = z.object({
  source: resourceSourceType.extract(["inline"]),
  value: z.string().min(1, "configuration.resources.value.required"),
});

export const remoteResourceSchema = z.object({
  source: resourceSourceType.extract(["remote"]),
  url: z.string().url("common.url.invalid"),
});

export const resourceSchema = z.discriminatedUnion("source", [
  inlineResourceSchema,
  remoteResourceSchema,
]);

export type RemoteResource = z.infer<typeof remoteResourceSchema>;
export type InlineResource = z.infer<typeof inlineResourceSchema>;

export type Resource = z.infer<typeof resourceSchema>;
