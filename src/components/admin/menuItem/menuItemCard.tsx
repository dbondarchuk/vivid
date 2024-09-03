import { Button, ButtonSizes, ButtonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { IconSelect } from "./iconSelect";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import { Link, LinkSizes, LinkVariants } from "@/components/ui/link";
import { useState } from "react";

export type MenuItemWithId = MenuItem & {
  id: string;
};

export type MenuItemProps = {
  item: MenuItemWithId;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: MenuItemWithId) => void;
};

export type MenuItemType = "MenuItem";

export interface MenuItemDragData {
  type: MenuItemType;
  item: MenuItemWithId;
}

export const itemTypes = ["icon", "link", "button"] as const;
const itemTypesLabels: Record<(typeof itemTypes)[number], string> = {
  icon: "Icon",
  link: "Link",
  button: "Button",
};

const itemTypesValues = Object.entries(itemTypesLabels).map(
  ([value, label]) =>
    ({
      value,
      label,
    } as IComboboxItem)
);

const linkVariantsValues = LinkVariants.map(
  (variant) =>
    ({
      value: variant,
      shortLabel: variant,
      label: (
        <Link href="#" variant={variant} onClick={(e) => e.preventDefault()}>
          {variant}
        </Link>
      ),
    } as IComboboxItem)
);

const buttonVariantsValues = ButtonVariants.map(
  (variant) =>
    ({
      value: variant,
      shortLabel: variant,
      label: (
        <Link
          button={true}
          href="#"
          variant={variant}
          size="sm"
          onClick={(e) => e.preventDefault()}
        >
          {variant}
        </Link>
      ),
    } as IComboboxItem)
);

const linkSizesValues = LinkSizes.map(
  (size) =>
    ({
      value: size,
      shortLabel: size,
      label: (
        <Link
          href="#"
          size={size}
          variant="default"
          onClick={(e) => e.preventDefault()}
        >
          {size}
        </Link>
      ),
    } as IComboboxItem)
);

const buttonSizesValues = ButtonSizes.map(
  (size) =>
    ({
      value: size,
      shortLabel: size,
      label: (
        <Link
          button
          href="#"
          size={size}
          variant="secondary"
          onClick={(e) => e.preventDefault()}
        >
          {size}
        </Link>
      ),
    } as IComboboxItem)
);

export function MenuItemCard({
  item,
  form,
  name,
  disabled,
  isOverlay,
  remove,
  update,
}: MenuItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: "MenuItem",
      item,
    } satisfies MenuItemDragData,
    attributes: {
      roleDescription: "Menu item",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const itemType = item.type;

  const changeType = (value: typeof itemType) => {
    const newValue = {
      ...item,
      type: value,
      variant: undefined,
      size: undefined,
    } as unknown as MenuItemWithId;

    update(newValue);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="justify-between relative flex flex-row border-b-2 border-secondary px-3 py-3 w-full">
        <Button
          type="button"
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
        >
          <span className="sr-only">Move menu item</span>
          <GripVertical />
        </Button>
        <span
          className={cn(!itemTypesLabels[itemType] ? "text-destructive" : "")}
        >
          {itemType ? itemTypesLabels[itemType] : "Invalid"}
        </span>
        <Button
          disabled={disabled}
          variant="destructive"
          className=""
          onClick={remove}
          size="sm"
          type="button"
        >
          <Trash size={20} />
        </Button>
      </CardHeader>
      <CardContent className="px-3 pb-6 pt-3 text-left relative grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${name}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item type</FormLabel>

              <FormControl>
                <Combobox
                  disabled={disabled}
                  className="flex w-full font-normal text-base"
                  values={itemTypesValues}
                  searchLabel="Select type"
                  value={field.value}
                  onItemSelect={(value) => {
                    field.onChange(value);
                    changeType(value as any);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${name}.url`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${name}.label`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Label" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {itemType === "icon" && (
          <FormField
            control={form.control}
            name={`${name}.icon`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <IconSelect field={field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {itemType === "link" && (
          <>
            <FormField
              control={form.control}
              shouldUnregister
              name={`${name}.variant`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant</FormLabel>

                  <FormControl>
                    <Combobox
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={linkVariantsValues}
                      searchLabel="Select link variant"
                      value={field.value}
                      onItemSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              shouldUnregister
              name={`${name}.size`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>

                  <FormControl>
                    <Combobox
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={linkSizesValues}
                      searchLabel="Select size"
                      value={field.value}
                      onItemSelect={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {itemType === "button" && (
          <>
            <FormField
              control={form.control}
              shouldUnregister
              name={`${name}.variant`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant</FormLabel>

                  <FormControl>
                    <Combobox
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={buttonVariantsValues}
                      searchLabel="Select button variant"
                      value={field.value}
                      onItemSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              shouldUnregister
              name={`${name}.size`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>

                  <FormControl>
                    <Combobox
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={buttonSizesValues}
                      searchLabel="Select size"
                      value={field.value}
                      onItemSelect={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {(itemType === "link" || itemType === "button") && (
          <>
            <FormField
              control={form.control}
              name={`${name}.prefixIcon`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix Icon</FormLabel>
                  <FormControl>
                    <IconSelect field={field} disabled={disabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.suffixIcon`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suffix Icon</FormLabel>
                  <FormControl>
                    <IconSelect field={field} disabled={disabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
