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
import { menuItemTypes, MenuItem, MenuItemType, SubMenuItem } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { IconSelect } from "./iconSelect";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import { Link, LinkSizes, LinkVariants } from "@/components/ui/link";
import { Text, TextFonts, TextSizes, TextWeights } from "@/components/ui/text";
import { Sortable } from "@/components/ui/sortable";
import { useMemo } from "react";
import { SubMenuItemCard, SubMenuItemWithId } from "./subMenuItemCard";

export type MenuItemFieldsProps = {
  type: MenuItemType;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
};

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

const textFontValues = TextFonts.map(
  (variant) =>
    ({
      value: variant,
      shortLabel: variant,
      label: (
        <Link
          button
          href="#"
          font={variant}
          variant="secondary"
          onClick={(e) => e.preventDefault()}
        >
          {variant}
        </Link>
      ),
    } as IComboboxItem)
);

const textSizesValues = TextSizes.map(
  (variant) =>
    ({
      value: variant,
      shortLabel: variant,
      label: (
        <Link
          button
          href="#"
          fontSize={variant}
          variant="secondary"
          onClick={(e) => e.preventDefault()}
        >
          {variant}
        </Link>
      ),
    } as IComboboxItem)
);

const textWeightsValues = TextWeights.map(
  (variant) =>
    ({
      value: variant,
      shortLabel: variant,
      label: (
        <Link
          button
          href="#"
          fontWeight={variant}
          variant="secondary"
          onClick={(e) => e.preventDefault()}
        >
          {variant}
        </Link>
      ),
    } as IComboboxItem)
);

export const MenuItemFields: React.FC<MenuItemFieldsProps> = ({
  form,
  name,
  disabled,
  type,
}) => {
  const {
    fields: subMenuItems,
    append: appendSubMenu,
    remove: removeSubMenu,
    swap: swapSubMenus,
    update: updateSubMenu,
  } = useFieldArray({
    control: form.control,
    name: `${name}.children`,
  });

  const subMenusIds = useMemo(
    () => subMenuItems.map((x) => x.id),
    [subMenuItems]
  );

  const sortSubMenus = (activeId: string, overId: string) => {
    const activeIndex = subMenuItems.findIndex((x) => x.id === activeId);
    const overIndex = subMenuItems.findIndex((x) => x.id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swapSubMenus(activeIndex, overIndex);
  };

  const addNewSubMenu = () => {
    appendSubMenu({
      type: "link",
    } as Partial<SubMenuItem> as SubMenuItem);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {type !== "submenu" && (
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
        )}
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
        {type === "icon" && (
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

        {type === "link" && (
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
                      allowClear
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
                      allowClear
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
        {type === "button" && (
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
                      allowClear
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
                      allowClear
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
        {(type === "link" || type === "button") && (
          <>
            <FormField
              control={form.control}
              shouldUnregister
              name={`${name}.font`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text font</FormLabel>

                  <FormControl>
                    <Combobox
                      allowClear
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={textFontValues}
                      searchLabel="Select text font"
                      value={field.value}
                      onItemSelect={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              shouldUnregister
              name={`${name}.fontSize`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text size</FormLabel>

                  <FormControl>
                    <Combobox
                      allowClear
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={textSizesValues}
                      searchLabel="Select text size"
                      value={field.value}
                      onItemSelect={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              shouldUnregister
              name={`${name}.fontWeight`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text weight</FormLabel>

                  <FormControl>
                    <Combobox
                      allowClear
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={textWeightsValues}
                      searchLabel="Select text weight"
                      value={field.value}
                      onItemSelect={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.prefixIcon`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix Icon</FormLabel>
                  <FormControl>
                    <IconSelect field={field} disabled={disabled} allowClear />
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
                    <IconSelect field={field} disabled={disabled} allowClear />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name={`${name}.className`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional classes</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="font-bold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {type === "submenu" && (
        <Sortable
          title="Sub Menu"
          ids={subMenusIds}
          onSort={sortSubMenus}
          onAdd={addNewSubMenu}
        >
          <div className="flex flex-grow flex-col gap-4">
            {subMenuItems.map((item, index) => {
              return (
                <SubMenuItemCard
                  form={form}
                  item={item as SubMenuItemWithId}
                  key={item.id}
                  name={`${name}.children.${index}`}
                  disabled={disabled}
                  remove={() => removeSubMenu(index)}
                />
              );
            })}
          </div>
        </Sortable>
      )}
    </>
  );
};
