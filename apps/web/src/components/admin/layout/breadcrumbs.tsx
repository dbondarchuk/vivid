"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbsContext,
  BreadcrumbSeparator,
} from "@vivid/ui";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { Fragment } from "react";

const useBreadcrumbs = () => {
  const pathname = usePathname();
  const { breadcrumbs, setBreadcrumbs } = React.useContext(BreadcrumbsContext);

  React.useEffect(() => {
    setBreadcrumbs(undefined);
  }, [pathname]);

  return breadcrumbs;
};

export const BreadcrumbsRender = () => {
  const items = useBreadcrumbs();
  if (!items?.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block">
                <Slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
