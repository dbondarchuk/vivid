"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EmailBuilder } from "@vivid/email-builder";
import {
  CommunicationChannel,
  getTemplateSchemaWithUniqueCheck,
  Template,
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
  SaveButton,
  toast,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTemplate, updateTemplate } from "./actions";
import { TextMessageBuilder } from "./text-message-builder";
import { TemplatesTemplate } from "./templates/type";

const checkUniqueName = async (name: string, id?: string) => {
  const url = `/admin/api/templates/check?name=${encodeURIComponent(name)}${id ? `&id=${encodeURIComponent(id)}` : ""}`;
  const response = await fetch(url, {
    method: "GET",
    cache: "default",
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

export const TemplateForm: React.FC<
  {
    args: any;
  } & (
    | { type: CommunicationChannel; template?: TemplatesTemplate }
    | { initialData: Template }
  )
> = ({ args, ...rest }) => {
  const initialData = "initialData" in rest ? rest.initialData : undefined;
  const type = initialData?.type || ("type" in rest ? rest.type : "email");
  const template = "template" in rest ? rest.template : undefined;

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
      type,
      ...(template || {}),
    },
  });

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData) {
          const { _id } = await createTemplate(data);
          router.push(`/admin/dashboard/templates/${_id}`);
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

  const { setError, trigger } = form;
  const onEmailBuilderValidChange = React.useCallback(
    (isValid: boolean) =>
      isValid
        ? trigger()
        : setError("value", {
            message: "Template is not valid",
          }),
    [setError, trigger]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full space-y-8"
      >
        <div className="flex flex-col gap-4 w-full h-full">
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
              <>
                {type === "email" && (
                  <FormItem className="w-full flex-grow relative h-full">
                    <FormControl>
                      <EmailBuilder
                        args={args}
                        value={field.value}
                        onIsValidChange={onEmailBuilderValidChange}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                {type === "text-message" && (
                  <TextMessageBuilder args={args} field={field} />
                )}
              </>
            )}
          />
        </div>
        <SaveButton form={form} ignoreDirty />
      </form>
    </Form>
  );
};
