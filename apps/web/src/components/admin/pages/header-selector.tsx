import {
  CustomerListModel,
  PageHeaderListModel,
  WithTotal,
} from "@vivid/types";
import { cn, ComboboxAsync, IComboboxItem, Skeleton, toast } from "@vivid/ui";
import Image from "next/image";
import React from "react";
import { useI18n } from "@vivid/i18n";

const HeaderShortLabel: React.FC<{
  header: PageHeaderListModel;
  row?: boolean;
}> = ({ header, row }) => {
  const t = useI18n("admin");
  return (
    <div
      className={cn(
        "flex gap-0.5  shrink overflow-hidden text-nowrap min-w-0 max-w-[var(--radix-popover-trigger-width)]",
        row ? "items-baseline" : "flex-col"
      )}
    >
      <span>{header.name}</span>
      {!row && (
        <span className="text-xs italic">
          {t("pages.headers.usedOnPages", {
            count: header.usedCount ?? 0,
          })}
        </span>
      )}
    </div>
  );
};

const HeaderLoader: React.FC<{}> = ({}) => {
  return (
    <div className="flex flex-col gap-0.5 overflow-hidden text-nowrap pl-6 w-full">
      <Skeleton className="min-w-36 max-w-80 w-full h-5" />
      <Skeleton className="min-w-36 max-w-80 w-full h-4" />
    </div>
  );
};

type BaseHeaderSelectorProps = {
  value?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (header?: PageHeaderListModel) => void;
};

type ClearableHeaderSelectorProps = BaseHeaderSelectorProps & {
  onItemSelect: (value: string | undefined) => void;
  allowClear: true;
};

type NonClearableHeaderSelectorProps = BaseHeaderSelectorProps & {
  onItemSelect: (value: string) => void;
  allowClear?: false;
};

export type HeaderSelectorProps =
  | NonClearableHeaderSelectorProps
  | ClearableHeaderSelectorProps;

export const HeaderSelector: React.FC<HeaderSelectorProps> = ({
  disabled,
  className,
  value,
  onItemSelect,
  onValueChange,
  allowClear,
}) => {
  const t = useI18n("admin");
  const [itemsCache, setItemsCache] = React.useState<
    Record<string, PageHeaderListModel>
  >({});

  const getHeaders = React.useCallback(
    async (page: number, search?: string) => {
      const limit = 10;
      let url = `/admin/api/pages/headers?page=${page}&limit=${limit}`;
      if (value) url += `&headerId=${encodeURIComponent(value)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        method: "GET",
        cache: "default",
      });

      if (response.status >= 400) {
        const text = await response.text();
        const message = `Request to fetch headers failed: ${response.status}; ${text}`;
        console.error(message);

        toast.error(t("common.toasts.error"));

        return {
          items: [],
          hasMore: false,
        };
      }

      const res = (await response.json()) as WithTotal<PageHeaderListModel>;

      setItemsCache((prev) => ({
        ...prev,
        ...res.items.reduce(
          (map, cur) => ({
            ...map,
            [cur._id]: cur,
          }),
          {} as typeof itemsCache
        ),
      }));

      return {
        items: res.items.map((header) => ({
          label: <HeaderShortLabel header={header} />,
          shortLabel: <HeaderShortLabel header={header} row />,
          value: header._id,
        })) satisfies IComboboxItem[],
        hasMore: page * limit < res.total,
      };
    },
    [value, setItemsCache, t]
  );

  React.useEffect(() => {
    onValueChange?.(value ? itemsCache[value] : undefined);
  }, [value, itemsCache]);

  return (
    <ComboboxAsync
      // @ts-ignore Allow clear passthrough
      onChange={onItemSelect}
      disabled={disabled}
      className={cn("flex font-normal text-base max-w-full", className)}
      placeholder={t("pages.form.header")}
      value={value}
      allowClear={allowClear}
      fetchItems={getHeaders}
      loader={<HeaderLoader />}
    />
  );
};
