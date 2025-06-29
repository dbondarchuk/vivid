"use client";

import { MenuItemCard } from "@/components/admin/menu-item/menu-item-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import {
  HeaderConfiguration,
  headerConfigurationSchema,
  headerShadowType,
  LinkMenuItem,
} from "@vivid/types";
import {
  Combobox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SaveButton,
  Sortable,
  Switch,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { updateHeaderConfiguration } from "./actions";

const headerShadowValues = Object.keys(headerShadowType.Values).map(
  (value) => ({
    value,
    label: `${value[0].toUpperCase()}${value.substring(1)}`,
  })
);

export const HeaderSettingsForm: React.FC<{
  values: HeaderConfiguration;
}> = ({ values }) => {
  const t = useI18n("admin");
  const form = useForm<HeaderConfiguration>({
    resolver: zodResolver(headerConfigurationSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: HeaderConfiguration) => {
    try {
      setLoading(true);
      await toastPromise(updateHeaderConfiguration(data), {
        success: t("appearance.header.form.toasts.changesSaved"),
        error: t("appearance.header.form.toasts.requestError"),
      });

      router.refresh();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const { fields, append, remove, swap, update } = useFieldArray({
    control: form.control,
    name: "menu",
  });

  const ids = useMemo(() => fields.map((x) => x.id), [fields]);

  const sort = (activeId: string, overId: string) => {
    const activeIndex = fields.findIndex((x) => x.id === activeId);
    const overIndex = fields.findIndex((x) => x.id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swap(activeIndex, overIndex);
  };

  const addNew = () => {
    append({
      type: "link",
    } as Partial<LinkMenuItem> as LinkMenuItem);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="flex gap-3 flex-col">
          <div className="gap-2 flex flex-col md:grid md:grid-cols-3 md:gap-4 items-center">
            <FormField
              control={form.control}
              name="showLogo"
              render={({ field }) => (
                <FormItem className="">
                  <div className="flex flex-row items-center gap-2 md:gap-4">
                    <FormControl>
                      <Switch
                        id="showLogo"
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex flex-col gap-2">
                      <FormLabel htmlFor="showLogo" className="cursor-pointer">
                        {t("appearance.header.form.showLogo")}
                      </FormLabel>
                      <FormDescription>
                        {t("appearance.header.form.showLogoDescription")}
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sticky"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center gap-2 md:gap-4">
                    <FormControl>
                      <Switch
                        id="sticky"
                        disabled={loading}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex flex-col gap-2">
                      <FormLabel htmlFor="sticky" className="cursor-pointer">
                        {t("appearance.header.form.stickyHeader")}
                      </FormLabel>
                      <FormDescription>
                        {t("appearance.header.form.stickyHeaderDescription")}
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shadow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("appearance.header.form.headerShadow")}
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      allowClear
                      values={headerShadowValues}
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      searchLabel={t("appearance.header.form.selectShadowType")}
                      value={field.value}
                      onItemSelect={(value) => {
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Sortable
            title={t("appearance.header.form.menu")}
            ids={ids}
            onSort={sort}
            onAdd={addNew}
          >
            <div className="flex flex-grow flex-col gap-4">
              {fields.map((item, index) => {
                return (
                  <MenuItemCard
                    supportsSubmenus
                    form={form}
                    item={item}
                    key={item.id}
                    name={`menu.${index}`}
                    disabled={loading}
                    remove={() => remove(index)}
                    update={(newValue) => update(index, newValue)}
                  />
                );
              })}
            </div>
          </Sortable>
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
