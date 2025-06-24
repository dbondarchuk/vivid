"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import { Editor } from "@monaco-editor/react";
import {
  getPageSchemaWithUniqueCheck,
  Page,
  pageTagSchema,
} from "@vivid/types";
import {
  DateTimePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  Link,
  SaveButton,
  Switch,
  TagInput,
  Textarea,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkUniqueSlug, createPage, updatePage } from "./actions";
import { is12hourUserTimeFormat } from "@vivid/utils";

export const PageForm: React.FC<{ initialData?: Page }> = ({ initialData }) => {
  const t = useI18n("admin");

  const formSchema = getPageSchemaWithUniqueCheck(
    (slug) => checkUniqueSlug(slug, initialData?._id),
    "pages.slugMustBeUnique"
  );

  type PageFormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: initialData || {
      publishDate: new Date(),
      published: true,
    },
  });

  const getTags = (value: string) => {
    let tags = value.split(/,\s?/g);
    if (tags.length === 1 && !tags[0]) tags = [];

    return tags;
  };

  const onSubmit = async (data: PageFormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData) {
          const { _id } = await createPage(data);
          router.push(`/admin/dashboard/pages/${_id}`);
        } else {
          await updatePage(initialData._id, data);

          router.refresh();
        }
      };

      await toastPromise(fn(), {
        success: t("pages.toasts.changesSaved"),
        error: t("common.toasts.error"),
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full lg:w-4/5 flex-grow">
                <FormLabel>
                  {t("pages.form.pageContent")}
                  <InfoTooltip>
                    <p>{t("pages.form.pageContentTooltip")}</p>
                    <p>
                      <Link
                        href="https://mdxjs.com/docs/what-is-mdx/"
                        target="_blank"
                        variant="primary"
                      >
                        {t("pages.form.learnMoreAboutMdx")}
                      </Link>
                    </p>
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Editor
                    height="100vh"
                    language="mdx"
                    theme="vs-dark"
                    value={field.value}
                    onChange={field.onChange}
                    onValidate={() => form.trigger(field.name)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col w-full lg:w-1/5 gap-2">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("pages.form.pageSlug")}{" "}
                    <InfoTooltip>
                      <p>{t("pages.form.pageSlugTooltip")}</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={t("pages.form.pageSlugPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t("pages.form.published")}{" "}
                      <InfoTooltip>
                        {t("pages.form.publishedTooltip")}
                      </InfoTooltip>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("pages.form.publishDate")}
                    <InfoTooltip>
                      {t("pages.form.publishDateTooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      use12HourFormat={is12hourUserTimeFormat()}
                      onChange={(e) => {
                        field.onChange(e);
                        field.onBlur();
                      }}
                      value={field.value}
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("pages.form.tags")}{" "}
                    <InfoTooltip>{t("pages.form.tagsTooltip")}</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        field.onBlur();
                      }}
                      tagValidator={pageTagSchema}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.form.title")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={t("pages.form.titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doNotCombine.title"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t("pages.form.doNotCombineTitle")}{" "}
                      <InfoTooltip>
                        <p>{t("pages.form.doNotCombineTitleTooltip")}</p>
                        <p>
                          <code className="text-xs sm:text-sm inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-2">
                            {"{website title} - {page title}"}
                          </code>
                        </p>
                      </InfoTooltip>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("pages.form.description")}{" "}
                    <InfoTooltip>
                      {t("pages.form.descriptionTooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      autoResize
                      placeholder={t("pages.form.descriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doNotCombine.description"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t("pages.form.doNotCombineDescription")}{" "}
                      <InfoTooltip>
                        <p>{t("pages.form.doNotCombineDescriptionTooltip")}</p>
                        <p>
                          <code className="text-xs sm:text-sm inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-2">
                            {"{website description}"}
                            <br />
                            {"{page description}"}
                          </code>
                        </p>
                      </InfoTooltip>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("pages.form.keywords")}{" "}
                    <InfoTooltip>{t("pages.form.keywordsTooltip")}</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      value={getTags(field.value || "")}
                      onChange={(value) =>
                        form.setValue("keywords", value.join(", "))
                      }
                      tagValidator={z
                        .string()
                        .min(2, "Keyword must be at least 2 characters")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doNotCombine.keywords"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t("pages.form.doNotCombineKeywords")}{" "}
                      <InfoTooltip>
                        <p>{t("pages.form.doNotCombineKeywordsTooltip")}</p>
                        <p>
                          <code className="text-xs sm:text-sm inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-2">
                            {"{website keywords}, {page keywords}"}
                          </code>
                        </p>
                      </InfoTooltip>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullWidth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t("pages.form.fullWidthPage")}{" "}
                      <InfoTooltip>
                        {t("pages.form.fullWidthPageTooltip")}
                      </InfoTooltip>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
