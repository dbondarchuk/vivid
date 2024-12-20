"use client";

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
import { toast } from "@/components/ui/use-toast";
import {
  BookingConfiguration,
  GeneralConfiguration,
  SmsConfiguration,
  smsConfigurationSchema,
  SocialConfiguration,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateSmsConfiguration } from "./actions";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { SaveButton } from "@/components/admin/forms/save-button";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { templateSafeWithError } from "@/lib/string";
import { getArguments } from "@/services/notifications/getArguments";
import { demoAppointment } from "../appointments/fixtures";

export const SmsSettingsForm: React.FC<{
  values: SmsConfiguration;

  bookingConfiguration: BookingConfiguration;
  generalConfiguration: GeneralConfiguration;
  socialConfiguration: SocialConfiguration;
}> = ({ values, ...configs }) => {
  const form = useForm<SmsConfiguration>({
    resolver: zodResolver(smsConfigurationSchema),
    mode: "all",
    values,
  });

  const { arg: demoArguments } = getArguments(
    demoAppointment,
    configs.bookingConfiguration,
    configs.generalConfiguration,
    configs.socialConfiguration
  );

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: SmsConfiguration) => {
    try {
      setLoading(true);
      await updateSmsConfiguration(data);
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
            name="authToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Auth token <InfoTooltip>TextBelt auth token</InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Auth token"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-full">
          <FormField
            control={form.control}
            name="autoReply"
            render={({ field }) => (
              <ResizablePanelGroup
                direction="horizontal"
                className="max-md:hidden"
              >
                <ResizablePanel className="pr-4">
                  <FormItem>
                    <FormLabel>
                      Auto reply
                      <InfoTooltip>
                        <p>
                          Can be used for notifying the user that they should
                          not reply to text message
                        </p>
                        <p>Optional</p>
                        <p>* Uses templated values</p>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Auto reply"
                        className="mx-0 focus:mx-1 active:mx-1"
                        autoResize
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0} characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="pl-4">
                  <FormItem>
                    <FormLabel>Preview</FormLabel>
                    <div
                      className="w-full text-sm"
                      dangerouslySetInnerHTML={{
                        __html: templateSafeWithError(
                          field.value || "",
                          demoArguments
                        ).replaceAll("\n", "<br/>"),
                      }}
                    />
                  </FormItem>
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          />
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
