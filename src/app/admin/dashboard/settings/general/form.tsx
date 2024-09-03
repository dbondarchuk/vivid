"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { GeneralConfiguration } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateGeneralConfiguration } from "./actions";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { TagInput } from "@/components/ui/tagInput";
import { SaveButton } from "@/components/admin/forms/save-button";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Website Name must be at least 3 characters" }),
  title: z
    .string()
    .min(3, { message: "Website Title must be at least 3 characters" }),
  description: z
    .string()
    .min(3, { message: "Website Description must be at least 3 characters" }),
  keywords: z
    .string()
    .min(3, { message: "Website Keywords must be at least 3 characters" }),
  phone: z.string().min(3, { message: "Phone number is required" }),
  email: z.string().email("Email is required"),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" })
    .optional(),
  url: z
    .string()
    .url("Website url should be valid URL address")
    .min(3, { message: "Website Name must be at least 3 characters" }),
  mapsUrl: z.string().url("Maps URL should be a valid URL").optional(),
  //   logo: string,
});

type FormValues = z.infer<typeof formSchema>;

export const GeneralSettingsForm: React.FC<{
  values: GeneralConfiguration;
}> = ({ values }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await updateGeneralConfiguration({
        ...data,
        logo: "",
      });
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

  const getTags = (value: string) => {
    let tags = value.split(/,\s?/g);
    if (tags.length === 1 && !tags[0]) tags = [];

    return tags;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="gap-8 md:grid md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Website name"
                    {...field}
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Website title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Website description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                  <InfoTooltip>Website keywords separated by comma</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <TagInput
                    {...field}
                    value={getTags(field.value)}
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="email"
                    placeholder="Website description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website base URL</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Website url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Address <InfoTooltip>Physical office address</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Website description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mapsUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Google Maps URL{" "}
                  <InfoTooltip>
                    Url to the physical office address on Google Maps
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Website description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
