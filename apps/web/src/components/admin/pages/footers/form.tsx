"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import {
  getPageFooterSchemaWithUniqueNameCheck,
  getPageHeaderSchemaWithUniqueNameCheck,
  LinkMenuItem,
  PageFooter,
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
import {
  checkUniquePageFooterName,
  createPageFooter,
  updatePageFooter,
} from "./actions";
import { PageBuilder } from "@vivid/page-builder";

export const PageFooterForm: React.FC<{
  initialData?: PageFooter;
  args: Record<string, any>;
}> = ({ initialData, args }) => {
  const t = useI18n("admin");

  const cachedUniqueSlugCheck = useDebounceCacheFn(
    checkUniquePageFooterName,
    300
  );

  const formSchema = getPageFooterSchemaWithUniqueNameCheck(
    (slug) => cachedUniqueSlugCheck(slug, initialData?._id),
    "pages.footers.name.unique"
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
    { title: t("pages.footers.title"), link: "/admin/dashboard/pages/footers" },
    {
      title: initialData?.name || t("pages.footers.new"),
      link: initialData?._id
        ? `/admin/dashboard/pages/footers/${initialData._id}`
        : "/admin/dashboard/pages/footers/new",
    },
  ];

  const { setError, trigger } = form;
  const onPageBuilderValidChange = React.useCallback(
    (isValid: boolean) =>
      isValid
        ? trigger()
        : setError("content", {
            message: t("templates.form.validation.templateNotValid"),
          }),
    [setError, trigger, t]
  );

  const onSubmit = async (data: PageFormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData) {
          const { _id } = await createPageFooter(data);
          router.push(`/admin/dashboard/pages/footers/${_id}`);
        } else {
          await updatePageFooter(initialData._id, data);

          router.refresh();
        }
      };

      await toastPromise(fn(), {
        success: t("pages.footers.toasts.changesSaved"),
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
          title={t(initialData ? "pages.footers.edit" : "pages.footers.new")}
          description={t(
            initialData
              ? "pages.footers.managePageFooter"
              : "pages.footers.addNewPageFooter"
          )}
        />

        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("pages.footers.form.name")}</FormLabel>
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
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full flex-grow relative">
                <FormControl>
                  <PageBuilder
                    args={args}
                    notAllowedBlocks={["Booking", "Popup"]}
                    value={field.value}
                    onIsValidChange={onPageBuilderValidChange}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SaveButton form={form} disabled={loading} ignoreDirty />
      </form>
    </Form>
  );
};
