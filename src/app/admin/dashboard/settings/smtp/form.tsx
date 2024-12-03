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
import { SmtpConfiguration, smtpConfigurationSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateSmtpConfiguration } from "./actions";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { Switch } from "@/components/ui/switch";
import { SaveButton } from "@/components/admin/forms/save-button";

export const SmtpSettingsForm: React.FC<{
  values: SmtpConfiguration;
}> = ({ values }) => {
  const form = useForm<SmtpConfiguration>({
    resolver: zodResolver(smtpConfigurationSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: SmtpConfiguration) => {
    try {
      setLoading(true);
      await updateSmtpConfiguration(data);
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
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP Host</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="smtp.email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP port</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="465" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP SSL</FormLabel>
                <FormControl className="block">
                  <Switch
                    {...field}
                    value={`${field.value}`}
                    disabled={loading}
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
                <FormLabel>
                  Sender email{" "}
                  <InfoTooltip>
                    Email address from which all emails will be sent
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled={loading}
                    placeholder="john@exampl.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth.user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  SMTP authentication user
                  <InfoTooltip>Username to log in into SMTP server</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="john" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth.pass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  SMTP authentication password
                  <InfoTooltip>Password to log in into SMTP server</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Input disabled={loading} type="password" {...field} />
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
