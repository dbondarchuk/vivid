import { cn } from "@/lib/utils";
import React from "react";

type ChildrenWithClassName = React.PropsWithChildren & {
  className?: string;
};

export const InputSuffix: React.FC<ChildrenWithClassName> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center min-w-max", className)}>
      {children}
    </div>
  );
};

export const InputGroupInput: React.FC<ChildrenWithClassName> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("block w-full border-0", className)}>{children}</div>
  );
};

export const InputGroup: React.FC<ChildrenWithClassName> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-md relative flex focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  );
};
