import { Services } from "@/lib/services";
import { cn } from "@/lib/utils";
import { ConfigurationService } from "@/services/configurationService";
import Image from "next/image";
import React from "react";

export const Logo: React.FC<{ className?: string }> = async (props) => {
  const { title, logo } =
    await Services.ConfigurationService().getConfiguration("general");

  return (
    <div
      className={cn("relative flex place-items-center gap-2", props.className)}
    >
      <Image
        className={cn(
          "relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert",
          props.className
        )}
        src={logo}
        alt={title}
        width={50}
        height={50}
        priority
      />
      <h1 {...props} className={cn(`font-bold text-2xl`, props.className)}>
        {title}
      </h1>
    </div>
  );
};
