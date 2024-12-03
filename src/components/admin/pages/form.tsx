"use client";

import { SaveButton } from "@/components/admin/forms/save-button";
import { FileInput } from "@/components/ui/file-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkUniqueSlug, createPage, updatePage } from "./actions";
import { Page } from "@/types";
import { InfoTooltip } from "../tooltip/infoTooltip";
import { Link } from "@/components/ui/link";
import { Editor } from "@monaco-editor/react";
import { TagInput } from "@/components/ui/tagInput";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/time-picker/date-time-picker";

export const PageForm: React.FC<{ initialData?: Page }> = ({ initialData }) => {
  const tagSchema = z
    .string()
    .min(3, "Tag should be at least 3 characters long");

  const formSchema = z.object({
    title: z.string().min(2, "Page title must be at least 2 characters"),
    content: z.string().min(1, "Page content must be at least 1 character"),
    slug: z
      .string()
      .min(1, { message: "Page slug must be at least 1 character" })
      .regex(
        /^[a-z0-9]+(?:[-\/][a-z0-9]+)*$/g,
        "Page slug must contain only latin lower case letters, digits, slash, and hyphens"
      )
      .refine((filename) => checkUniqueSlug(filename, initialData?._id), {
        message: "Page slug must be unique",
      }),
    description: z.string().min(1, "Page description is required"),
    keywords: z.string().min(1, "Page keywords are requried"),
    published: z.coerce.boolean().default(false),
    publishDate: z.date({ required_error: "Publish date is required" }),
    tags: z.array(tagSchema).optional(),
    doNotCombine: z.object({
      title: z.coerce.boolean().optional(),
      description: z.coerce.boolean().optional(),
      keywords: z.coerce.boolean().optional(),
    }),
    fullWidth: z.coerce.boolean().optional(),
  });

  type PageFormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
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

      if (!initialData) {
        const { _id } = await createPage(data);
        router.push(`/admin/dashboard/pages/${_id}`);
      } else {
        await updatePage(initialData._id, data);

        router.refresh();
      }

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
                      tagValidator={tagSchema}
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
