"use client";

import { AppSelector } from "@/components/admin/apps/appSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConnectedApp,
  DefaultAppsConfiguration,
  defaultAppsConfigurationSchema,
} from "@vivid/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SaveButton,
  toast,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateDefaultAppsConfiguration } from "./actions";

export const DefaultAppsConfigurationForm: React.FC<{
  values: DefaultAppsConfiguration;
  apps: ConnectedApp[];
}> = ({ values, apps }) => {
  const form = useForm<DefaultAppsConfiguration>({
    resolver: zodResolver(defaultAppsConfigurationSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: DefaultAppsConfiguration) => {
    try {
      setLoading(true);
      await updateDefaultAppsConfiguration(data);
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="email.appId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email sender</FormLabel>
                <FormControl>
                  <AppSelector
                    apps={apps}
                    onItemSelect={field.onChange}
                    scope="mail-send"
                    value={field.value}
                    disabled={loading}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="textMessage.appId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text message sender</FormLabel>
                <FormControl>
                  <AppSelector
                    apps={apps}
                    onItemSelect={field.onChange}
                    scope="text-message-send"
                    value={field.value}
                    disabled={loading}
                    className="w-full"
                    allowClear
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assetsStorage.appId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assets storage</FormLabel>
                <FormControl>
                  <AppSelector
                    apps={apps}
                    onItemSelect={field.onChange}
                    scope="assets-storage"
                    value={field.value}
                    disabled={loading}
                    className="w-full"
                    allowClear
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
