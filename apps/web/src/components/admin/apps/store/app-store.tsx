"use client";
import { Markdown } from "@/components/web/markdown";
import { AvailableApps } from "@vivid/app-store";
import { useI18n } from "@vivid/i18n";
import { App } from "@vivid/types";
import {
  Button,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ConnectedAppNameAndLogo,
  Heading,
  Input,
  Link,
} from "@vivid/ui";
import React from "react";

export type AppStoreProps = {};

const AppCard: React.FC<{ app: App }> = ({ app }) => {
  const t = useI18n("apps");
  return (
    <Card className="pt-4 h-full">
      <CardContent className="flex flex-col gap-4 h-full">
        <ConnectedAppNameAndLogo app={{ name: app.name }} t={t} />
        <div className="text-default mt-2 flex-grow text-sm line-clamp-3">
          <Markdown markdown={t(app.description.text)} notProse />
        </div>
        <Link
          href={`/admin/dashboard/apps/store/${app.name}`}
          button
          variant="outline"
        >
          {t("common.details")}
        </Link>
      </CardContent>
    </Card>
  );
};

export const AppStore: React.FC<AppStoreProps> = ({}) => {
  const t = useI18n("apps");
  const apps = React.useMemo(
    () => Object.values(AvailableApps).filter((app) => !app.isHidden),
    []
  );

  const categories = React.useMemo(
    () => Array.from(new Set(apps.flatMap((app) => app.category))),
    [apps]
  );

  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string | undefined>(undefined);

  const filteredApps = React.useMemo(
    () =>
      apps.filter((app) => {
        if (
          category &&
          !app.category.some(
            (c) => c.toLocaleLowerCase() === category.toLocaleLowerCase()
          )
        )
          return false;

        if (search.length === 0) return true;

        const s = search.toLocaleLowerCase();
        return (
          app.name.toLocaleLowerCase().includes(s) ||
          app.displayName.toLocaleLowerCase().includes(s) ||
          app.category.some((c) => c.toLocaleLowerCase().includes(s)) ||
          app.description.text.toLocaleLowerCase().includes(s)
        );
      }),
    [apps, category, search]
  );

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <Heading
          title={t("common.appStore")}
          description={t("common.addNewApps")}
        />
        <Input
          placeholder={t("common.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-96"
        />
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-row justify-between items-center">
            <div>
              <h2 className="text-emphasis mt-0 text-base font-semibold leading-none">
                {t("common.mostPopular")}
              </h2>
            </div>
            <div className="flex flex-row gap-2 justify-end">
              <CarouselPrevious className="relative translate-y-0 rounded-none border-none left-0 top-0" />
              <CarouselNext className="relative translate-y-0 rounded-none border-none right-0 top-0" />
            </div>
          </div>
          <CarouselContent className="items-stretch w-0 min-w-full">
            {apps
              .filter((app) => app.isFeatured)
              .map((app) => (
                <CarouselItem
                  className="w-full md:basis-1/2 lg:basis-1/3"
                  key={app.name}
                >
                  <AppCard app={app} />
                </CarouselItem>
              ))}
          </CarouselContent>
        </div>
      </Carousel>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-emphasis mt-0 text-base font-semibold leading-none">
              {t("common.allApps")}
            </h2>
          </div>
          <div className="flex flex-row flex-wrap gap-2 md:justify-end">
            <Button
              variant={!!category ? "secondary" : "default"}
              onClick={() => setCategory(undefined)}
            >
              {t("common.all")}
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category !== cat ? "secondary" : "default"}
                onClick={() => setCategory(cat)}
                className="capitalize"
              >
                {t(`${cat}`)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <AppCard app={app} key={app.name} />
          ))}
        </div>
      </div>
    </div>
  );
};
