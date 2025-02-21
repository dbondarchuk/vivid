"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EmailBuilder } from "@vivid/email-builder";
import { getTemplateSchemaWithUniqueCheck, Template } from "@vivid/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  SaveButton,
  toast,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTemplate, updateTemplate } from "./actions";

const checkUniqueName = async (name: string, id?: string) => {
  const url = `/admin/api/templates/check?name=${encodeURIComponent(name)}${id ? `&id=${encodeURIComponent(id)}` : ""}`;
  const response = await fetch(url, {
    cache: "force-cache",
    headers: {
      "Cache-Control": "max-age=10", // Cache for 10 seconds
    },
    method: "GET",
    next: {
      revalidate: 10,
    },
  });

  if (response.status >= 400) {
    toast.error("Request failed.");
    const text = await response.text();
    console.error(
      `Request to validate template name failed: ${response.status}; ${text}`
    );

    return false;
  }

  return (await response.json()) as boolean;
};

export const EmailTemplateForm: React.FC<{
  initialData?: Template;
  args: any;
}> = ({ initialData, args }) => {
  const formSchema = getTemplateSchemaWithUniqueCheck(
    (name) => checkUniqueName(name, initialData?._id),
    "Template name must be unique"
  );

  type TemplateFormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: initialData || {
      type: "email",
    },
  });

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData) {
          const { _id } = await createTemplate(data);
          router.push(`/admin/dashboard/templates/email/${_id}`);
        } else {
          await updateTemplate(initialData._id, data);

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
        <div className="flex flex-col gap-4 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Template name <InfoTooltip>Unique template name</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Template name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-full flex-grow relative">
                <FormControl>
                  <EmailBuilder
                    args={args}
                    value={field.value}
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
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
