import { getLocale } from "@vivid/i18n/server";
import { ServicesContainer } from "@vivid/services";
import { cn, Link } from "@vivid/ui";
import { getPageData } from "@vivid/utils";
import { DateTime } from "luxon";
import React from "react";

export type PageListProps = {
  pagesPerPage?: number;
  tag: string;
  className?: string;
  readMoreClassName?: string;
  morePostsClassName?: string;
  postClassName?: string;
};

export const PageList: React.FC<PageListProps> = async ({
  tag,
  className,
  readMoreClassName,
  morePostsClassName,
  postClassName,
  pagesPerPage = 10,
}) => {
  const page = parseInt(getPageData()?.searchParams?.page) - 1 || 0;
  const locale = await getLocale();

  const pages = await ServicesContainer.PagesService().getPages({
    publishStatus: [true],
    maxPublishDate: new Date(),
    tags: [tag],
    sort: [
      {
        id: "publishDate",
        desc: true,
      },
    ],
    limit: pagesPerPage,
    offset: page * pagesPerPage,
  });

  return (
    <div className={cn("flex flex-col w-full gap-4", className)}>
      {pages.items.map((page) => (
        <React.Fragment key={page._id}>
          <div className={cn("flex flex-col gap-2", postClassName)}>
            <div className="text-muted-foreground text-sm">
              {DateTime.fromJSDate(page.publishDate).toLocaleString(
                DateTime.DATE_HUGE,
                { locale }
              )}
            </div>
            <h3 className="mt-0 mb-2">
              <Link href={`/${page.slug}`}>{page.title}</Link>
            </h3>
            {page.description && (
              <div
                className="font-primary font-normal"
                dangerouslySetInnerHTML={{
                  __html: page.description.replaceAll("\n", "<br/>"),
                }}
              />
            )}
            {/* <MdxContent source={page.content} options={{ excerpt: true }} /> */}
            <div>
              <Link
                href={`/${page.slug}`}
                variant="default"
                button
                className={readMoreClassName}
              >
                Read more
              </Link>
            </div>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0" />
        </React.Fragment>
      ))}
      <div className="flex flex-row items-stretch">
        <div>
          {page >= 1 && (
            <Link
              href={`?page=${page}`}
              variant="default"
              className={morePostsClassName}
            >
              Newer posts
            </Link>
          )}
        </div>
        <div>
          {pages.total > (page + 1) * pagesPerPage && (
            <Link
              href={`?page=${page + 2}`}
              variant="default"
              className={morePostsClassName}
            >
              Older posts
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
