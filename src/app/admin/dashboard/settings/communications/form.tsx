"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  CommunicationsConfiguration,
  communicationsConfigurationSchema,
  ConnectedApp,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateCommunicationsConfiguration } from "./actions";
import { SaveButton } from "@/components/admin/forms/save-button";
import { AppSelector } from "@/components/admin/apps/appSelector";

export const CommunicationsConfigurationForm: React.FC<{
  values: CommunicationsConfiguration;
  apps: ConnectedApp[];
}> = ({ values, apps }) => {
  const form = useForm<CommunicationsConfiguration>({
    resolver: zodResolver(communicationsConfigurationSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: CommunicationsConfiguration) => {
    try {
      setLoading(true);
      await updateCommunicationsConfiguration(data);
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
                    type="mail-send"
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
                    type="text-message-send"
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
