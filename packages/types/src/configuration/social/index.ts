import { z } from "zod";

export const socialType = z.enum(
  [
    "instagram",
    "facebook",
    "linkedin",
    "github",
    "twitter",
    "twitch",
    "youtube",
  ],
  { message: "configuration.social.type.invalid" }
);

export type SocialLinkType = z.infer<typeof socialType>;

export const socialTypeLabels = Object.keys(socialType.Values).reduce(
  (acc, cur) => ({
    ...acc,
    [cur]: `${cur[0].toUpperCase()}${cur.substring(1)}`,
  }),
  {} as Record<SocialLinkType, string>
);

export const socialLinkSchema = z.object({
  url: z.string().min(3, "common.url.invalid"),
  type: socialType,
});

export type SocialLink = z.infer<typeof socialLinkSchema>;

export const socialConfigurationSchema = z.object({
  links: z.array(socialLinkSchema).optional(),
});

export type SocialConfiguration = z.infer<typeof socialConfigurationSchema>;
