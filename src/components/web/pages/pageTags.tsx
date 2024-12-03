import { getPageData } from "@/lib/pageDataCache";
import { cn } from "@/lib/utils";

export type PageTagsProps = {
  className?: string;
  tagClassName?: string;
};

export const PageTags: React.FC<PageTagsProps> = ({
  className,
  tagClassName,
}) => (
  <div className={cn("flex flex-row gap-2 flex-wrap", className)}>
    {getPageData().page.tags?.map((tag) => (
      <div
        key={tag}
        className={cn(
          "text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full bg-white text-gray-700 border",
          tagClassName
        )}
      >
        {tag}
      </div>
    ))}
  </div>
);
