"use client";

import { MenuItemCard } from "@/components/admin/menuItem/menuItemCard";
import { MdxContent } from "@/components/web/mdx/mdxContentClient";
import { zodResolver } from "@hookform/resolvers/zod";
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
  toast,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { updateFooterConfiguration } from "./actions";

export const FooterSettingsForm: React.FC<{
  values: FooterConfiguration;
}> = ({ values }) => {
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
      await updateFooterConfiguration(data);
      router.refresh();
      toast({
        variant: "default",
        title: "Saved",
        description: "Your changes were saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
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
                    Use custom footer
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
                      Footer content
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
                    <FormLabel>Preview</FormLabel>
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
                      Contact us label{" "}
                      <InfoTooltip>
                        Defaults to &quote;Contact us&quote;
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Contact us"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Sortable title="Links" ids={ids} onSort={sort} onAdd={addNew}>
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
