import * as Menu from "@/components/ui/dropdown-menu";
import { ComponentProps, PropsWithChildren } from "react";
import { buttonClasses } from "./button";
import { cva } from "class-variance-authority";

export const dropdownContentClasses = cva(["z-[101]"]);

export function DropdownMenu({ children }: PropsWithChildren) {
  return <Menu.DropdownMenu>{children}</Menu.DropdownMenu>;
}

export function DropdownTrigger({
  children,
  ...props
}: PropsWithChildren<ComponentProps<typeof Menu.DropdownMenuTrigger>>) {
  return (
    <Menu.DropdownMenuTrigger className={buttonClasses()} {...props}>
      {children}
    </Menu.DropdownMenuTrigger>
  );
}

export function DropdownContent({ children }: PropsWithChildren) {
  return (
    <Menu.DropdownMenuPortal>
      <Menu.DropdownMenuContent className={dropdownContentClasses()}>
        {children}
      </Menu.DropdownMenuContent>
    </Menu.DropdownMenuPortal>
  );
}

export function DropdownItem({
  children,
  active,
  ...props
}: PropsWithChildren<
  ComponentProps<typeof Menu.DropdownMenuItem> & { active?: boolean }
>) {
  return (
    <Menu.DropdownMenuItem className={buttonClasses({ active })} {...props}>
      {children}
    </Menu.DropdownMenuItem>
  );
}
