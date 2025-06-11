import { Discount, WithTotal } from "@vivid/types";
import { cn, ComboboxAsync, IComboboxItem, Skeleton, toast } from "@vivid/ui";
import { DateTime } from "luxon";
import React from "react";

type PromoCode = Discount & { code: string };

const PromoCodeShortLabel: React.FC<{
  promoCode: PromoCode;
  row?: boolean;
}> = ({ promoCode, row }) => {
  let active = !!promoCode.enabled;
  if (
    promoCode.startDate &&
    DateTime.fromJSDate(promoCode.startDate) > DateTime.now()
  )
    active = false;
  if (
    promoCode.endDate &&
    DateTime.fromJSDate(promoCode.endDate) < DateTime.now()
  )
    active = false;

  return row ? (
    <div className="flex flex-row gap-2 items-center">
      <span>{promoCode.code}</span>
      <span className="text-sm italic">
        -{promoCode.type === "amount" && "$"}
        {promoCode.value}
        {promoCode.type === "percentage" && "%"}
      </span>
    </div>
  ) : (
    <div className="flex flex-col  gap-1 shrink overflow-hidden text-nowrap min-w-0 max-w-[var(--radix-popover-trigger-width)]">
      <span>{promoCode.code}</span>
      {!active && <span className="font-bold uppercase">Not active</span>}
      <span className="text-xs italic">{promoCode.name}</span>
      <span className="text-sm italic">
        -{promoCode.type === "amount" && "$"}
        {promoCode.value}
        {promoCode.type === "percentage" && "%"}
      </span>
    </div>
  );
};

const PromoCodeLoader: React.FC<{}> = ({}) => {
  return (
    <div className="flex flex-col items-center gap-1 overflow-hidden text-nowrap pl-6 w-full">
      <Skeleton className="min-w-40 max-w-96 w-full h-5" />
      <Skeleton className="min-w-36 max-w-80 w-full h-4" />
      <Skeleton className="min-w-36 max-w-80 w-full h-4" />
    </div>
  );
};

type BasePromoCodeSelectorProps = {
  value?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (promoCode?: PromoCode) => void;
};

type ClearablePromoCodeSelectorProps = BasePromoCodeSelectorProps & {
  onItemSelect: (value: string | undefined) => void;
  allowClear: true;
};

type NonClearablePromoCodeSelectorProps = BasePromoCodeSelectorProps & {
  onItemSelect: (value: string) => void;
  allowClear?: false;
};

export type PromoCodeSelectorProps =
  | NonClearablePromoCodeSelectorProps
  | ClearablePromoCodeSelectorProps;

export const PromoCodeSelector: React.FC<PromoCodeSelectorProps> = ({
  disabled,
  className,
  value,
  onItemSelect,
  onValueChange,
  allowClear,
}) => {
  const [itemsCache, setItemsCache] = React.useState<Record<string, PromoCode>>(
    {}
  );

  const getCustomers = React.useCallback(
    async (page: number, search?: string) => {
      const limit = 10;
      let url = `/admin/api/discounts?page=${page}&limit=${limit}`;
      if (value) url += `&priorityId=${encodeURIComponent(value)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        method: "GET",
        cache: "default",
      });

      if (response.status >= 400) {
        toast.error("Request failed.");
        const text = await response.text();
        console.error(
          `Request to fetch discounts failed: ${response.status}; ${text}`
        );

        return {
          items: [],
          hasMore: false,
        };
      }

      const res = (await response.json()) as WithTotal<Discount>;

      const codes: PromoCode[] = res.items.flatMap((discount) =>
        discount.codes.map((code) => ({
          ...discount,
          code,
        }))
      );

      setItemsCache((prev) => ({
        ...prev,
        ...codes.reduce(
          (map, cur) => ({
            ...map,
            [cur.code]: cur,
          }),
          {} as typeof itemsCache
        ),
      }));

      return {
        items: codes.map((promoCode) => ({
          label: <PromoCodeShortLabel promoCode={promoCode} />,
          shortLabel: <PromoCodeShortLabel promoCode={promoCode} row />,
          value: promoCode.code,
        })) satisfies IComboboxItem[],
        hasMore: page * limit < res.total,
      };
    },
    [value, setItemsCache]
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
      placeholder="Select promo code"
      value={value}
      allowClear={allowClear}
      fetchItems={getCustomers}
      loader={<PromoCodeLoader />}
    />
  );
};
