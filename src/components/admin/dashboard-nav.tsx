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

  if (!items?.length) {
    return null;
  }

  console.log("isActive", isMobileNav, isMinimized);

  return (
    <nav className="grid items-start gap-2">
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
            return (
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value={index.toString()} className="border-none">
                  <AccordionTrigger
                    className={cn(
                      "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      "hover:no-underline focus:no-underline",
                      path === item.href ? "bg-accent" : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                  >
                    <span className="flex gap-2">
                      <Icon className={`ml-3 size-5 flex-none`} />
                      <span className="mr-2 truncate">{item.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-5">
                    {item.items.map((subItem, jndex) => {
                      const SubIcon = Icons[subItem.icon || "arrowRight"];
                      return (
                        <Link
                          key={jndex}
                          href={subItem.href || "/"}
                          className={cn(
                            "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            path === subItem.href ? "bg-accent" : "transparent",
                            subItem.disabled && "cursor-not-allowed opacity-80"
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
