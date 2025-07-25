"use client";

import { usePortalContext } from "@vivid/builder";
import { DrawerContent } from "@vivid/ui";
import { ReplaceOriginalColors } from "../helpers/replace-original-colors";

export const PortalDrawerContent = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { body } = usePortalContext();
  return (
    <DrawerContent className={className} container={body}>
      <ReplaceOriginalColors />
      {children}
    </DrawerContent>
  );
};
