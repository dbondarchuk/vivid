import { DefaultRootProps } from "@measured/puck";

export type RootProps = DefaultRootProps & {
  header?: boolean;
  footer?: boolean;
};

export const RootRenderer = (
  header: React.ReactNode,
  footer: React.ReactNode
) => {
  const Root = ({
    children,
    header: isHeader,
    footer: isFooter,
    puck,
  }: RootProps) => {
    return (
      <>
        {isHeader && header}
        {children}
        {isFooter && footer}
      </>
    );
  };

  Root.displayName = "Root";

  return Root;
};