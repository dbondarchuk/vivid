import { AvailableApps } from "@/apps";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import React from "react";
import { ConnectedAppNameAndLogo } from "../connectedAppProperties";
import { Button } from "@/components/ui/button";
import { AppScopeLabels } from "./appScopeLabels";
import { Markdown } from "@/components/web/markdown/Markdown";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { AddOrUpdateAppButton } from "../addOrUpdateAppDialog";
import { getInstalledApps } from "./actions";
import { InstallComplexAppButton } from "./installComplexAppButton";

export type AppDetailsProps = {
  appName: string;
};

export const AppDetails: React.FC<AppDetailsProps> = async ({ appName }) => {
  const app = React.useMemo(() => AvailableApps[appName], [appName]);
  const installed = await getInstalledApps(appName);

  //if (app.isHidden) return null;

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-row gap-2">
        <Link
          button
          variant="outline"
          href="/admin/dashboard/apps/store"
          className="border-none rounded-none -ml-4"
        >
          <ArrowLeft />
        </Link>
        <Heading title="App store" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col w-full gap-8">
          <ConnectedAppNameAndLogo
            app={app}
            nameClassName="text-3xl text-accent-foreground"
            logoClassName="w-12 h-12"
          />
          <div className="flex flex-row flex-wrap gap-4 items-center">
            {app.isFeatured && <span className="text-emphasis">Featured</span>}
            {app.scope.map((scope) => (
              <span
                className="bg-secondary text-secondary-foreground text-emphasis rounded-md p-2 text-xs capitalize"
                key={scope}
              >
                {AppScopeLabels[scope]}
              </span>
            ))}
          </div>
          <div>
            {app.type !== "complex" ? (
              <AddOrUpdateAppButton appType={app.name}>
                <Button
                  variant="default"
                  disabled={app.dontAllowMultiple && installed.length > 0}
                >
                  {app.dontAllowMultiple && installed.length > 0
                    ? "Already installed"
                    : "Add app"}
                </Button>
              </AddOrUpdateAppButton>
            ) : (
              <InstallComplexAppButton
                appName={appName}
                installed={installed.length}
              />
            )}
          </div>

          <Markdown markdown={app.description.text} className="max-w-full" />
        </div>

        {app.description.images?.length && (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            {/* <div className="flex flex-col gap-6">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 justify-end">
                  <CarouselPrevious className="relative translate-y-0 rounded-none border-none left-0 top-0" />
                  <CarouselNext className="relative translate-y-0 rounded-none border-none right-0 top-0" />
                </div>
              </div> */}
            <CarouselContent className="h-full">
              {app.description.images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="items-center flex justify-center h-full"
                >
                  <Image
                    src={image}
                    width={800}
                    height={400}
                    alt={app.displayName}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* </div> */}

            <CarouselPrevious className="rounded-none border-none left-0" />
            <CarouselNext className="rounded-none border-none right-0" />
          </Carousel>
        )}
      </div>
    </div>
  );
};
