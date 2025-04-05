import { CaretDownIcon } from "@radix-ui/react-icons";
import React from "react";
import { cn } from "../utils";
import { Button, ButtonProps } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Separator } from "./separator";

export type SplitButtonProps = ButtonProps & {
  caretClassName?: string;
  dropdownChildren: React.ReactNode | React.ReactNode[];
};

export const SplitButton: React.FC<SplitButtonProps> = ({
  variant,
  className,
  caretClassName,
  dropdownChildren,
  ...props
}) => (
  <div className="flex items-center">
    <Button
      variant={variant}
      className={cn("rounded-r-none", className)}
      {...props}
    />
    <Separator orientation="vertical" />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={cn("rounded-l-none border-l-0 px-2", caretClassName)}
        >
          <CaretDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{dropdownChildren}</DropdownMenuContent>
    </DropdownMenu>
  </div>
);
