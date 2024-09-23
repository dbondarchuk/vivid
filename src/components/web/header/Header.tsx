import { MenuItem } from "@/types/configuration";
import { icons, Menu, X } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../../ui/drawer";
import { Icon } from "../../ui/icon";
import { Link } from "../../ui/link";
import { HeaderWithScrollShadow } from "./HeaderWithScrollShadow";
import { Services } from "@/lib/services";
import { cn } from "@/lib/utils";

export type HeaderProps = {
  menu: MenuItem[];
  name: string;
};

const HeaderBase: React.FC<HeaderProps> = ({ menu, name }) => {
  const getLink = (isSidebar: boolean) => {
    return menu.map((item) => {
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
                "inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base",
                item.className
              )}
            >
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
                "hover:text-gray-600 transition-colors",
                item.className
              )}
              href={item.url}
            >
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
            </Link>
          );
      }
    });
  };

  return (
    <header className="text-black font-body w-full fixed bg-white font-light z-50 transition-all duration-300">
      <div className="container mx-auto flex flex-wrap p-5 flex-row items-center gap-4">
        <a href="/" className="flex title-font font-medium items-center">
          <span className="ml-3 text-xl font-body font-medium">{name}</span>
        </a>
        <div className="hidden ml-auto md:flex flex-wrap gap-2 items-center text-base justify-center">
          <nav className="flex flex-row gap-6 items-center">
            {getLink(false)}
          </nav>
        </div>
        <div className="flex ml-auto md:hidden">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white flex flex-col  h-full w-[300px] mt-24 fixed bottom-0 right-0 left-auto rounded-none">
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
                <nav className="flex flex-col gap-8 items-center">
                  {getLink(true)}
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
  const { menu } = await Services.ConfigurationService().getConfiguration(
    "header"
  );
  const { name } = await Services.ConfigurationService().getConfiguration(
    "general"
  );

  return (
    <HeaderWithScrollShadow>
      <HeaderBase menu={menu} name={name} />
    </HeaderWithScrollShadow>
  );
};
