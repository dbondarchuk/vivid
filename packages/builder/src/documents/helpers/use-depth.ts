import { useMemo } from "react";
import { useBlockHierarchy } from "../editor/context";

export const useDepth = (blockId: string) => {
  const blockHierarchy = useBlockHierarchy(blockId) || [];

  return useMemo(() => {
    return blockHierarchy.length;
  }, [blockHierarchy.length]);
};
