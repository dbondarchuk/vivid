"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import {
  getPageHeaderSchemaWithUniqueNameCheck,
  LinkMenuItem,
  PageHeader,
  pageHeaderShadowType,
} from "@vivid/types";
import {
  Breadcrumbs,
  Checkbox,
  Combobox,
  Heading,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SaveButton,
  Sortable,
  Switch,
  toastPromise,
  use12HourFormat,
  useDebounceCacheFn,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MenuItemCard } from "../../menu-item/menu-item-card";
import {
  checkUniquePageHeaderName,
  createPageHeader,
  updatePageHeader,
} from "./actions";

export const PageHeaderForm: React.FC<{ initialData?: PageHeader }> = ({
  initialData,
}) => {
  const t = useI18n("admin");
  const uses12HourFormat = use12HourFormat();

  const headerShadowValues = pageHeaderShadowType.map((value) => ({
    value,
    label: t(`pages.headers.shadowType.${value}`),
  }));

  const cachedUniqueSlugCheck = useDebounceCacheFn(
    checkUniquePageHeaderName,
    300
  );

  const formSchema = getPageHeaderSchemaWithUniqueNameCheck(
    (slug) => cachedUniqueSlugCheck(slug, initialData?._id),
    "pages.headers.name.unique"
  );

  type PageFormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: initialData || {},
  });

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    { title: t("pages.title"), link: "/admin/dashboard/pages" },
    { title: t("pages.headers.title"), link: "/admin/dashboard/pages/headers" },
    {
      title: initialData?.name || t("pages.headers.new"),
      link: initialData?._id
        ? `/admin/dashboard/pages/headers/${initialData._id}`
        : "/admin/dashboard/pages/headers/new",
    },
  ];

  const onSubmit = async (data: PageFormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData) {
          const { _id } = await createPageHeader(data);
          router.push(`/admin/dashboard/pages/headers/${_id}`);
        } else {
          await updatePageHeader(initialData._id, data);

          router.refresh();
        }
      };

      await toastPromise(fn(), {
        success: t("pages.headers.toasts.changesSaved"),
        error: t("common.toasts.error"),
      });
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
      <Breadcrumbs items={breadcrumbItems} />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <Heading
          title={t(initialData ? "pages.headers.edit" : "pages.headers.new")}
          description={t(
            initialData
              ? "pages.headers.managePageHeader"
              : "pages.headers.addNewPageHeader"
          )}
        />

        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.headers.form.name")}</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    disabled={loading}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 flex-col md:flex-row-reverse">
            <div className="gap-2 flex flex-col flex-grow-1">
              <FormField
                control={form.control}
                name="showLogo"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex flex-row items-start gap-2">
                      <FormControl>
                        <Checkbox
                          id="showLogo"
                          disabled={loading}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="flex flex-col gap-1">
                        <FormLabel
                          htmlFor="showLogo"
                          className="cursor-pointer"
                        >
                          {t("pages.headers.form.showLogo")}
                        </FormLabel>
                        <FormDescription>
                          {t("pages.headers.form.showLogoDescription")}
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
                    <div className="flex flex-row items-start gap-2">
                      <FormControl>
                        <Checkbox
                          id="sticky"
                          disabled={loading}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="flex flex-col gap-1">
                        <FormLabel htmlFor="sticky" className="cursor-pointer">
                          {t("pages.headers.form.stickyHeader")}
                        </FormLabel>
                        <FormDescription>
                          {t("pages.headers.form.stickyHeaderDescription")}
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
                      {t("pages.headers.form.headerShadow")}
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        allowClear
                        values={headerShadowValues}
                        disabled={loading}
                        className="flex w-full font-normal text-base"
                        searchLabel={t("pages.headers.form.selectShadowType")}
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
              title={t("pages.headers.form.menu")}
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
        </div>
        <SaveButton form={form} disabled={loading} ignoreDirty />
      </form>
    </Form>
  );
};
