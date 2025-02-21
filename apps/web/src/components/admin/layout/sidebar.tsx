"use client";
import { NavItemWithOptionalChildren } from "@vivid/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Link,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@vivid/ui";
import { ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { UserNav } from "./user-nav";

type SidebarProps = {
  className?: string;
  menuItems: NavItemWithOptionalChildren[];
  name: string;
  logo?: string;
};

export const NavIcon = ({
  children,
  className,
}: {
  children: React.ReactElement;
  className?: string;
}) => {
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      ...(child?.props || {}),
      // @ts-ignore we have classname
      className,
    })
  );
};

export const AppSidebar: React.FC<SidebarProps> = ({
  className,
  menuItems,
  name,
  logo,
}) => {
  const path = usePathname();
  const { open, isMobile, setOpenMobile } = useSidebar();
  React.useEffect(() => {
    setOpenMobile(false);
  }, [path, setOpenMobile]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={logo} alt={name} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{name}</span>
            {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
          <SidebarMenu>
            {menuItems.map((item) => (
              <React.Fragment key={item.title}>
                {item.items?.length ? (
                  isMobile || open ? (
                    <Collapsible
                      asChild
                      defaultOpen={path === item.href}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && (
                              <NavIcon className={`size-5`}>
                                {item.icon}
                              </NavIcon>
                            )}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subItem.href || "/"}>
                                    {subItem.icon && (
                                      <NavIcon className={`size-5`}>
                                        {subItem.icon}
                                      </NavIcon>
                                    )}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && (
                              <NavIcon className={`size-5`}>
                                {item.icon}
                              </NavIcon>
                            )}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-fit rounded-lg px-2 py-2 flex flex-col gap-2"
                          side={isMobile ? "bottom" : "right"}
                          align={isMobile ? "end" : "start"}
                        >
                          <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                          {item.items?.map((subItem) => (
                            <DropdownMenuItem asChild key={subItem.title}>
                              <Link
                                href={subItem.href || "/"}
                                className="inline-flex items-center gap-2 cursor-pointer"
                              >
                                {subItem.icon && (
                                  <NavIcon className={`size-5`}>
                                    {subItem.icon}
                                  </NavIcon>
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  )
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className="text-sidebar-foreground"
                      asChild
                      tooltip={item.title}
                    >
                      <Link href={item.href || "/"}>
                        {item.icon && (
                          <NavIcon className={`size-5`}>{item.icon}</NavIcon>
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserNav />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export const AppSidebarTrigger: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      aria-label="Toggle Sidebar"
      className={cn(className)}
      onClick={toggleSidebar}
    >
      <Menu />
    </Button>
  );
};
