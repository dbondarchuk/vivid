import { getPageData } from "@vivid/utils";
import { DateTime } from "luxon";

export type PagePublishDateProps = {
  format?: string;
  className?: string;
};

export const PagePublishDate: React.FC<PagePublishDateProps> = ({
  className,
  format = "FFF",
}) => (
  <time className={className}>
    {DateTime.fromJSDate(getPageData().page.publishDate).toFormat(format)}
  </time>
);
