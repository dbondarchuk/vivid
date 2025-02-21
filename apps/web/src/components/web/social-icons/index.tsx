import { SocialLinkType, socialTypeLabels } from "@vivid/types";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  LucideIcon,
  TwitchIcon,
  YoutubeIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { SocialIconsProps } from "./types";

const iconsMap: Record<SocialLinkType, LucideIcon> = {
  facebook: FacebookIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  twitch: TwitchIcon,
  twitter: TwitchIcon,
  youtube: YoutubeIcon,
};

export const SocialIcons: React.FC<SocialIconsProps> = ({
  icons,
  iconProps,
}) => {
  if (!icons) return null;

  return (
    <nav className="flex flex-row gap-4">
      {icons.map((icon, index) => {
        const Icon = iconsMap[icon.type];
        if (!Icon) return null;

        return (
          <Link
            href={icon.url}
            target="_blank"
            key={index}
            aria-label={socialTypeLabels[icon.type]}
          >
            <Icon size={24} {...iconProps} />
          </Link>
        );
      })}
    </nav>
  );
};
