import { ServicesContainer } from "@vivid/services";
import {
  ButtonMenuItem,
  HeaderConfiguration,
  LinkMenuItem,
  MenuItem,
} from "@vivid/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  cn,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Link,
  Logo,
} from "@vivid/ui";
import { ChevronDown, icons, Menu, X } from "lucide-react";
import React from "react";
import { HeaderWithScrollShadow } from "./withScrollShadow";

export type HeaderProps = {
  name: string;
  logo?: string;
  config: HeaderConfiguration;
};

const LinkRender: React.FC<{
  item: Omit<LinkMenuItem, "url" | "type"> | ButtonMenuItem;
}> = ({ item }) => (
  <>
    {item.prefixIcon && (
      <Icon
        name={item.prefixIcon as keyof typeof icons}
        className="w-6 h-6"
        aria-label={item.label}
      />
    )}
    {item.label}
    {item.suffixIcon && (
      <Icon
        name={item.suffixIcon as keyof typeof icons}
        className="w-6 h-6"
        aria-label={item.label}
      />
    )}
  </>
);

const HeaderBase: React.FC<HeaderProps> = ({ name, logo, config }) => {
  const getLink = (item: MenuItem, isSidebar: boolean) => {
    switch (item.type) {
      case "icon":
        return (
          <Link
            href={item.url}
            className={cn("no-underline inline-flex gap-2", item.className)}
            key={item.url}
          >
            <Icon
              name={item.icon as keyof typeof icons}
              className="w-6 h-6"
              aria-label={item.label}
            />
            {isSidebar && <span className="ml-2">{item.label}</span>}
          </Link>
        );

      case "button":
        return (
          <Link
            button
            variant={item.variant}
            size={item.size}
            key={item.url}
            href={item.url}
            font={item.font}
            fontSize={item.fontSize}
            fontWeight={item.fontWeight}
            className={cn(
              "bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base inline-flex items-center gap-1",
              item.className
            )}
          >
            <LinkRender item={item} />
          </Link>
        );

      case "link":
      default:
        return (
          <Link
            key={item.url}
            variant={item.variant}
            size={item.size}
            font={item.font}
            fontSize={item.fontSize}
            fontWeight={item.fontWeight}
            className={cn(
              "hover:text-gray-600 transition-colors inline-flex items-center gap-1",
              item.className
            )}
            href={item.url}
          >
            <LinkRender item={item} />
          </Link>
        );
    }
  };

  return (
    <header
      className={cn(
        "text-black font-primary w-full bg-background font-light z-50 transition-all duration-300",
        config?.sticky && "sticky top-0",
        config?.shadow === "static" && "drop-shadow-md"
      )}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-row items-center gap-4">
        <Logo name={name} logo={logo} showLogo={config?.showLogo} />
        <div className="hidden ml-auto md:flex flex-wrap gap-2 items-center text-base justify-center">
          <nav className="flex flex-row gap-6 items-center">
            {/* <NavigationMenu>
              <NavigationMenuList>
                {config?.menu?.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.type !== "submenu" ? (
                      <NavigationMenuLink asChild>
                        {getLink(item, false)}
                      </NavigationMenuLink>
                    ) : (
                      <>
                        <NavigationMenuTrigger>
                          <LinkRender item={item} />
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="p-6">
                            {item.children.map((subItem, jndex) => (
                              <NavigationMenuLink key={jndex}>
                                {getLink(subItem, false)}
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu> */}
            {config?.menu?.map((item, index) => (
              <React.Fragment key={index}>
                {item.type !== "submenu" ? (
                  getLink(item, false)
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex gap-1 items-center group cursor-pointer">
                      <LinkRender item={item} />
                      <ChevronDown
                        size={16}
                        className="group-data-[state=open]:rotate-180 transition-transform"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-1">
                      {item.children.map((subItem, jndex) => (
                        <DropdownMenuItem
                          key={jndex}
                          asChild
                          className="text-base"
                        >
                          {getLink(subItem, false)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex ml-auto md:hidden">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white flex flex-col  h-full min-w-[100px] max-w-fit mt-24 fixed bottom-0 right-0 left-auto rounded-none">
              <DrawerHeader>
                <DrawerClose asChild className="">
                  <Button
                    variant="ghost"
                    className="w-fit ml-auto"
                    aria-label="Close"
                  >
                    <X />
                  </Button>
                </DrawerClose>
              </DrawerHeader>
              <div className="w-full py-6 px-4">
                <nav className="flex flex-col gap-3 items-end">
                  {config?.menu?.map((item, index) =>
                    item.type !== "submenu" ? (
                      <React.Fragment key={index}>
                        {getLink(item, true)}
                      </React.Fragment>
                    ) : (
                      <Accordion type="single" collapsible key={index}>
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger>
                            <LinkRender item={item} />
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col gap-2 pl-2">
                            {item.children.map((subItem, jndex) => (
                              <div key={jndex}>{getLink(subItem, true)}</div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )
                  )}
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export const Header: React.FC = async () => {
  const { header, general } =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "header",
      "general"
    );

  const baseHeader = (
    <HeaderBase name={general.name} logo={general.logo} config={header} />
  );

  if (header?.shadow === "on-scroll") {
    return <HeaderWithScrollShadow>{baseHeader}</HeaderWithScrollShadow>;
  }

  return baseHeader;
};
