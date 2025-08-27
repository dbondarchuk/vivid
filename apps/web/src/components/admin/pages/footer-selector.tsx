import { useI18n } from "@vivid/i18n";
import { PageFooterListModel, WithTotal } from "@vivid/types";
import { cn, ComboboxAsync, IComboboxItem, Skeleton, toast } from "@vivid/ui";
import React from "react";

const FooterShortLabel: React.FC<{
  footer: PageFooterListModel;
  row?: boolean;
}> = ({ footer, row }) => {
  const t = useI18n("admin");
  return (
    <div
      className={cn(
        "flex gap-0.5  shrink overflow-hidden text-nowrap min-w-0 max-w-[var(--radix-popover-trigger-width)]",
        row ? "items-baseline" : "flex-col",
      )}
    >
      <span>{footer.name}</span>
      {!row && (
        <span className="text-xs italic">
          {t("pages.footers.usedOnPages", {
            count: footer.usedCount ?? 0,
          })}
        </span>
      )}
    </div>
  );
};

const FooterLoader: React.FC<{}> = ({}) => {
  return (
    <div className="flex flex-col gap-0.5 overflow-hidden text-nowrap pl-6 w-full">
      <Skeleton className="min-w-36 max-w-80 w-full h-5" />
      <Skeleton className="min-w-36 max-w-80 w-full h-4" />
    </div>
  );
};

type BaseFooterSelectorProps = {
  value?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (footer?: PageFooterListModel) => void;
};

type ClearableFooterSelectorProps = BaseFooterSelectorProps & {
  onItemSelect: (value: string | undefined) => void;
  allowClear: true;
};

type NonClearableFooterSelectorProps = BaseFooterSelectorProps & {
  onItemSelect: (value: string) => void;
  allowClear?: false;
};

export type FooterSelectorProps =
  | NonClearableFooterSelectorProps
  | ClearableFooterSelectorProps;

export const FooterSelector: React.FC<FooterSelectorProps> = ({
  disabled,
  className,
  value,
  onItemSelect,
  onValueChange,
  allowClear,
}) => {
  const t = useI18n("admin");
  const [itemsCache, setItemsCache] = React.useState<
    Record<string, PageFooterListModel>
  >({});

  const getFooters = React.useCallback(
    async (page: number, search?: string) => {
      const limit = 10;
      let url = `/admin/api/pages/footers?page=${page}&limit=${limit}`;
      if (value) url += `&footerId=${encodeURIComponent(value)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        method: "GET",
        cache: "default",
      });

      if (response.status >= 400) {
        const text = await response.text();
        const message = `Request to fetch footers failed: ${response.status}; ${text}`;
        console.error(message);

        toast.error(t("common.toasts.error"));

        return {
          items: [],
          hasMore: false,
        };
      }

      const res = (await response.json()) as WithTotal<PageFooterListModel>;

      setItemsCache((prev) => ({
        ...prev,
        ...res.items.reduce(
          (map, cur) => ({
            ...map,
            [cur._id]: cur,
          }),
          {} as typeof itemsCache,
        ),
      }));

      return {
        items: res.items.map((footer) => ({
          label: <FooterShortLabel footer={footer} />,
          shortLabel: <FooterShortLabel footer={footer} row />,
          value: footer._id ?? "",
        })) satisfies IComboboxItem[],
        hasMore: page * limit < res.total,
      };
    },
    [value, setItemsCache, t],
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
      placeholder={t("pages.form.footer")}
      value={value}
      allowClear={allowClear}
      fetchItems={getFooters}
      loader={<FooterLoader />}
    />
  );
};
