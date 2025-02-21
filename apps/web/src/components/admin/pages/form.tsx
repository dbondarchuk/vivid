"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

export const PageForm: React.FC<{ initialData?: Page }> = ({ initialData }) => {
  const formSchema = getPageSchemaWithUniqueCheck(
    (slug) => checkUniqueSlug(slug, initialData?._id),
    "Page slug must be unique"
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
        success: "Your changes were saved.",
        error: "There was a problem with your request.",
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
                  Page content
                  <InfoTooltip>
                    <p>Page content using MDX format</p>
                    <p>
                      <Link
                        href="https://mdxjs.com/docs/what-is-mdx/"
                        target="_blank"
                        variant="primary"
                      >
                        Learn more about MDX
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
                    Page slug{" "}
                    <InfoTooltip>
                      <p>Page relative URL.</p>
                      <p>
                        For example, page with slug{" "}
                        <code className="text-xs sm:text-sm inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-2">
                          my-new-page
                        </code>{" "}
                        will be available at{" "}
                        <code className="text-xs sm:text-sm inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-2">
                          {`${window?.location?.origin}/my-new-page`}
                        </code>
                      </p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Page slug"
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
                      Published?{" "}
                      <InfoTooltip>
                        Is page visible to your visitors
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
                    Publish date
                    <InfoTooltip>
                      Publish date will be used for SEO, to determine
                      chronological order, and to determine if it is visible to
                      visitors yet
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
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
                    Tags{" "}
                    <InfoTooltip>Page tags for easy distinction</InfoTooltip>
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
                  <FormLabel>Page title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Page title"
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
                      Do not combine title{" "}
                      <InfoTooltip>
                        <p>
                          Should the page title be combined with website title
                          for SEO like
                        </p>
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
                    Page description{" "}
                    <InfoTooltip>
                      It is also used by page list component (a.k.a blog list)
                      for showing preview
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      autoResize
                      placeholder="Page description"
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
                      Do not combine description{" "}
                      <InfoTooltip>
                        <p>
                          Should the page description be combined with website
                          description for SEO like
                        </p>
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
                    Keywords{" "}
                    <InfoTooltip>Page keywords separated by comma</InfoTooltip>
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
                      Do not combine keywords
                      <InfoTooltip>
                        <p>
                          Should the page keywords be combined with website
                          keywords like
                        </p>
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
                      Full width page{" "}
                      <InfoTooltip>
                        If enabled, page will not be wrapped in{" "}
                        <em>Container</em> element
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
