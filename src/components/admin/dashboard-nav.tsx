"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/admin/icons";
import { cn } from "@/lib/utils";
import { NavItemWithOptionalChildren } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import React from "react";
import { v4 } from "uuid";

interface DashboardNavProps {
  items: NavItemWithOptionalChildren[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  const [openSubMenu, setOpenSubMenu] = React.useState<string>();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex flex-col gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          if (item.href) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.disabled ? "/" : item.href}
                    className={cn(
                      "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === item.href ? "bg-accent" : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <Icon className={`ml-3 size-5 flex-none`} />

                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ""
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? "hidden" : "inline-block"}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          if (item.items) {
            const id = `item-${index}`;

            return (
              <Accordion
                type="single"
                collapsible
                key={index}
                onValueChange={setOpenSubMenu}
              >
                <AccordionItem value={id} className="border-none">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AccordionTrigger
                        className={cn(
                          "flex items-center gap-2 overflow-hidden rounded-md py-2 pr-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          "hover:no-underline focus:no-underline",
                          path === item.href ||
                            (item.items.some(
                              (subItem) => subItem.href === path
                            ) &&
                              openSubMenu !== id)
                            ? "bg-accent"
                            : "transparent",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        <span className="flex gap-2">
                          <Icon className={`ml-3 size-5 flex-none`} />
                          {isMobileNav || (!isMinimized && !isMobileNav) ? (
                            <span className="mr-2 truncate">{item.title}</span>
                          ) : (
                            ""
                          )}
                        </span>
                      </AccordionTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      side="right"
                      sideOffset={8}
                      className={!isMinimized ? "hidden" : "inline-block"}
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                  <AccordionContent
                    className={cn(
                      "transition-all flex flex-col gap-1 py-1",
                      isMobileNav || (!isMinimized && !isMobileNav)
                        ? "pl-5"
                        : "pl-2"
                    )}
                  >
                    {item.items.map((subItem, jndex) => {
                      const SubIcon = Icons[subItem.icon || "arrowRight"];
                      return (
                        <Tooltip key={jndex}>
                          <TooltipTrigger asChild>
                            <Link
                              href={subItem.href || "/"}
                              className={cn(
                                "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                path === subItem.href
                                  ? "bg-accent"
                                  : "transparent",
                                subItem.disabled &&
                                  "cursor-not-allowed opacity-80"
                              )}
                            >
                              <SubIcon className={`ml-3 size-5 flex-none`} />

                              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                                <span className="mr-2 truncate">
                                  {subItem.title}
                                </span>
                              ) : (
                                ""
                              )}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            align="center"
                            side="right"
                            sideOffset={8}
                            className={!isMinimized ? "hidden" : "inline-block"}
                          >
                            {subItem.title}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          }
        })}
      </TooltipProvider>
    </nav>
  );
}
