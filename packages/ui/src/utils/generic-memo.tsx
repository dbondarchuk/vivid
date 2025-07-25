import { ComponentProps, ComponentType, memo } from "react";

export const genericMemo: <T extends ComponentType<any>>(
  component: T,
  propsAreEqual?: (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>
  ) => boolean
) => T = memo;
