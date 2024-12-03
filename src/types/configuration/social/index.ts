import { zOptionalOrMinLengthString } from "@/lib/schema";
import { z } from "zod";

export const socialConfigurationSchema = z.object({
  instagram: zOptionalOrMinLengthString(
    3,
    "Instagram handle must be at least 3 characters"
  ),
  facebook: zOptionalOrMinLengthString(
    3,
    "Facebook handle must be at least 3 characters"
  ),
});

export type SocialConfiguration = z.infer<typeof socialConfigurationSchema>;
