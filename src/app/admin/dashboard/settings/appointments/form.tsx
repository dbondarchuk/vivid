"use client";

import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  BookingConfiguration,
  bookingConfigurationSchema,
  ConnectedApp,
  GeneralConfiguration,
  SocialConfiguration,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { updateBookingConfiguration } from "./actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveButton } from "@/components/admin/forms/save-button";
import { MainTab } from "./tabs/main";
import { EmailTab } from "./tabs/email";
import { ShiftsTab } from "./tabs/shifts";
import { AddonsTab } from "./tabs/addons";
import { OptionsTab } from "./tabs/options";
import { cn } from "@/lib/utils";
import { FieldsTab } from "./tabs/fields";
import { TextMessagesTab } from "./tabs/textMessages";
import { RemindersTab } from "./tabs/reminders";
import { demoAppointment } from "./fixtures";
import { getArguments } from "@/services/notifications/getArguments";
import { CalendarSourcesTab } from "./tabs/calendarSources";

export const AppointmentsSettingsForm: React.FC<{
  values: BookingConfiguration;
  generalSettings: GeneralConfiguration;
  socialSettings: SocialConfiguration;
  apps: ConnectedApp[];
}> = ({ values, generalSettings, socialSettings, apps }) => {
  const form = useForm<BookingConfiguration>({
    resolver: zodResolver(bookingConfigurationSchema),
    mode: "all",
    reValidateMode: "onChange",
    values,
  });

  const { arg: demoArguments } = getArguments(
    demoAppointment,
    form.getValues(),
    generalSettings,
    socialSettings
  );

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: BookingConfiguration) => {
    try {
      setLoading(true);
      await updateBookingConfiguration(data);
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

  const mainTabInvalid =
    form.getFieldState("maxWeeksInFuture").invalid ||
    form.getFieldState("timezone").invalid ||
    form.getFieldState("slotStartMinuteStep").invalid ||
    form.getFieldState("minAvailableTimeBeforeSlot").invalid ||
    form.getFieldState("minAvailableTimeAfterSlot").invalid;

  const triggerValidation = () => {
    form.trigger();
    form.trigger("email");
    form.trigger("textMessages");
    form.trigger("reminders");
    form.trigger("addons");
    form.trigger("fields");
    form.trigger("options");
  };

  React.useEffect(triggerValidation, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative flex flex-col gap-2"
      >
        <Tabs
          onValueChange={triggerValidation}
          defaultValue={"main"}
          className="space-y-4"
          orientation="vertical"
        >
          <TabsList className="w-full flex-wrap h-auto">
            <TabsTrigger
              value="main"
              className={cn(mainTabInvalid ? "text-destructive" : "")}
            >
              Main
            </TabsTrigger>
            <TabsTrigger
              value="calendarSources"
              className={cn(
                form.getFieldState("calendarSources").invalid
                  ? "text-destructive"
                  : ""
              )}
            >
              Calendar sources
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className={cn(
                form.getFieldState("email").invalid ? "text-destructive" : ""
              )}
            >
              Emails
            </TabsTrigger>
            <TabsTrigger
              value="textMessages"
              className={cn(
                form.getFieldState("textMessages").invalid
                  ? "text-destructive"
                  : ""
              )}
            >
              Text Messages
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className={cn(
                form.getFieldState("reminders").invalid
                  ? "text-destructive"
                  : ""
              )}
            >
              Reminders
            </TabsTrigger>
            <TabsTrigger
              value="shifts"
              className={cn(
                form.getFieldState("workHours").invalid
                  ? "text-destructive"
                  : ""
              )}
            >
              Shifts
            </TabsTrigger>
            <TabsTrigger
              value="addons"
              className={cn(
                form.getFieldState("addons").invalid ? "text-destructive" : ""
              )}
            >
              Addons
            </TabsTrigger>
            <TabsTrigger
              value="fields"
              className={cn(
                form.getFieldState("fields").invalid ? "text-destructive" : ""
              )}
            >
              Fields
            </TabsTrigger>
            <TabsTrigger
              value="options"
              className={cn(
                form.getFieldState("options").invalid ? "text-destructive" : ""
              )}
            >
              Options
            </TabsTrigger>
          </TabsList>
          <TabsContent value="main">
            <MainTab form={form} />
          </TabsContent>
          <TabsContent value="calendarSources">
            <CalendarSourcesTab form={form} apps={apps} />
          </TabsContent>
          <TabsContent value="email">
            <EmailTab form={form} demoArguments={demoArguments} />
          </TabsContent>
          <TabsContent value="textMessages">
            <TextMessagesTab form={form} demoArguments={demoArguments} />
          </TabsContent>
          <TabsContent value="reminders">
            <RemindersTab form={form} demoArguments={demoArguments} />
          </TabsContent>
          <TabsContent value="shifts">
            <ShiftsTab form={form} />
          </TabsContent>
          <TabsContent value="addons">
            <AddonsTab form={form} />
          </TabsContent>
          <TabsContent value="fields">
            <FieldsTab form={form} />
          </TabsContent>
          <TabsContent value="options">
            <OptionsTab form={form} />
          </TabsContent>
        </Tabs>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
