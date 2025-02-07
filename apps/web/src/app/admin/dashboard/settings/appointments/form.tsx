"use client";

import { getArguments } from "@vivid/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookingConfiguration,
  bookingConfigurationSchema,
  ConnectedApp,
  GeneralConfiguration,
  SocialConfiguration,
} from "@vivid/types";
import {
  cn,
  Form,
  SaveButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@vivid/ui";
import { demoAppointment } from "@vivid/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateBookingConfiguration } from "./actions";
import { AddonsTab } from "./tabs/addons";
import { CalendarSourcesTab } from "./tabs/calendarSources";
import { FieldsTab } from "./tabs/fields";
import { MainTab } from "./tabs/main";
import { OptionsTab } from "./tabs/options";
import { ShiftsTab } from "./tabs/shifts";

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
    form.getFieldState("slotStart").invalid ||
    form.getFieldState("minAvailableTimeBeforeSlot").invalid ||
    form.getFieldState("minAvailableTimeAfterSlot").invalid;

  const triggerValidation = () => {
    form.trigger();
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
              value="fields"
              className={cn(
                form.getFieldState("fields").invalid ? "text-destructive" : ""
              )}
            >
              Fields
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
