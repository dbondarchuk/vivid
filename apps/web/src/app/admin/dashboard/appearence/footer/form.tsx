"use client";

import { MenuItemCard } from "@/components/admin/menu-item/menu-item-card";
import { MdxContent } from "@/components/web/mdx/mdx-content-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import { useFieldArray, useForm } from "react-hook-form";
import { Editor } from "@monaco-editor/react";
import {
  FooterConfiguration,
  footerConfigurationSchema,
  LinkMenuItem,
} from "@vivid/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SaveButton,
  ScrollArea,
  Sortable,
  SupportsMarkdownTooltip,
  Switch,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { updateFooterConfiguration } from "./actions";

export const FooterSettingsForm: React.FC<{
  values: FooterConfiguration;
}> = ({ values }) => {
  const t = useI18n("admin");
  const form = useForm<FooterConfiguration>({
    resolver: zodResolver(footerConfigurationSchema),
    mode: "all",
    values: values || {
      isCustom: false,
      links: [],
    },
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: FooterConfiguration) => {
    try {
      setLoading(true);

      await toastPromise(updateFooterConfiguration(data), {
        success: t("appearance.footer.form.toasts.changesSaved"),
        error: t("appearance.footer.form.toasts.requestError"),
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
    name: "links",
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

  const isCustom = form.watch("isCustom");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <FormField
          control={form.control}
          name="isCustom"
          render={({ field }) => (
            <FormItem className="">
              <div className="flex flex-row items-center gap-2 md:gap-4">
                <FormControl>
                  <Switch
                    id="useCustomFooter"
                    disabled={loading}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="flex flex-col gap-2">
                  <FormLabel
                    htmlFor="useCustomFooter"
                    className="cursor-pointer"
                  >
                    {t("appearance.footer.form.useCustomFooter")}
                  </FormLabel>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCustom ? (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <ResizablePanelGroup
                direction="horizontal"
                className="max-md:hidden"
              >
                <ResizablePanel className="pr-1">
                  <FormItem>
                    <FormLabel>
                      {t("appearance.footer.form.footerContent")}
                      <SupportsMarkdownTooltip supportsMdx />
                    </FormLabel>
                    <FormControl>
                      <Editor
                        height="60vh"
                        language="mdx"
                        theme="vs-dark"
                        value={field.value}
                        onChange={field.onChange}
                        onValidate={() => form.trigger(field.name)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="pl-1">
                  <FormItem>
                    <FormLabel>{t("appearance.footer.form.preview")}</FormLabel>
                    {/* <IFrame className="h-[60vh] w-full"> */}
                    <ScrollArea className="h-[60vh] w-full">
                      <MdxContent source={field.value || ""} />
                    </ScrollArea>
                    {/* </IFrame> */}
                  </FormItem>
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          />
        ) : (
          <div className="gap-8 flex flex-col">
            <div className="gap-2 flex flex-col md:grid md:grid-cols-3 md:gap-4">
              <FormField
                control={form.control}
                name="contactUsLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("appearance.footer.form.contactUsLabel")}{" "}
                      <InfoTooltip>
                        {t("appearance.footer.form.contactUsLabelTooltip")}
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder={t(
                          "appearance.footer.form.contactUsPlaceholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Sortable
              title={t("appearance.footer.form.links")}
              ids={ids}
              onSort={sort}
              onAdd={addNew}
            >
              <div className="flex flex-grow flex-col gap-4">
                {fields.map((item, index) => {
                  return (
                    <MenuItemCard
                      form={form}
                      item={item}
                      key={item.id}
                      name={`links.${index}`}
                      disabled={loading}
                      remove={() => remove(index)}
                      update={(newValue) => update(index, newValue)}
                    />
                  );
                })}
              </div>
            </Sortable>
          </div>
        )}
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
