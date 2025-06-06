"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { useDebounce } from "../hooks";
import { cn } from "../utils";
import { ComboboxTrigger, IComboboxItem, Loader } from "./combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type BaseComboboAsyncProps = {
  placeholder?: string;
  emptyMessage?: string;
  searchLabel?: string;
  value?: string;
  fetchItems: (
    page: number,
    search?: string
  ) => Promise<{
    items: IComboboxItem[];
    hasMore: boolean;
  }>;
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
  loader?: React.ReactNode;
};

type ClearableComboboAsyncProps = BaseComboboAsyncProps & {
  onChange: (value: string | undefined) => void;
  allowClear: true;
};

type NonClearableComboboAsyncProps = BaseComboboAsyncProps & {
  onChange: (value: string | undefined) => void;
  allowClear?: false;
};

export type ComboboAsyncProps =
  | NonClearableComboboAsyncProps
  | ClearableComboboAsyncProps;

export const ComboboxAsync: React.FC<ComboboAsyncProps> = ({
  placeholder = "Select an item...",
  emptyMessage = "No items found.",
  searchLabel = "Search items...",
  value,
  onChange,
  fetchItems,
  debounceMs = 300,
  disabled,
  className,
  loader = (
    <div className="flex items-center justify-center py-2">
      <Loader />
    </div>
  ),
  ...rest
}) => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<IComboboxItem[]>([]);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, debounceMs);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [initialLoad, setInitialLoad] = React.useState(true);

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  // Get selected item label
  const selectedItem = React.useMemo(
    () => items.find((item) => item.value === value),
    [items, value]
  );

  // Reset when search changes
  React.useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch]);

  // Load items when component mounts, search changes, or more items are needed
  React.useEffect(() => {
    const loadItems = async () => {
      if (!hasMore && !initialLoad) return;

      setLoading(true);
      try {
        const result = await fetchItems(page, debouncedSearch);

        if (page === 1) {
          setItems(result.items);
        } else {
          setItems((prev) => [...prev, ...result.items]);
        }

        setHasMore(result.hasMore);
        setInitialLoad(false);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        toast.error("There was a problem with your request.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [debouncedSearch, page, fetchItems, initialLoad, hasMore]);

  // Load more when scrolled to bottom
  React.useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading, hasMore]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <ComboboxTrigger
          allowClear={"allowClear" in rest && !!rest.allowClear}
          onClear={() => onChange(undefined as any as string)}
          open={open}
          className={className}
          {...rest}
        >
          {selectedItem
            ? (selectedItem.shortLabel ?? selectedItem.label)
            : placeholder}
        </ComboboxTrigger>
      </PopoverTrigger>
      <PopoverContent
        className={"min-w-max p-0 w-[var(--radix-popper-anchor-width)]"}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchLabel}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && page === 1 ? (
              <div className="py-2">{loader}</div>
            ) : items.length === 0 && !loading ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
                {/* Loading indicator at the bottom */}
                {loading && page > 1 && <div className="py-2">{loader}</div>}
                {/* Invisible element for intersection observer */}
                {hasMore && !loading && <div ref={ref} className="h-1" />}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
