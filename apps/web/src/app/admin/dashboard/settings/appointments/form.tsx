"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookingConfiguration, bookingConfigurationSchema } from "@vivid/types";
import {
  cn,
  Form,
  SaveButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateBookingConfiguration } from "./actions";
import { CalendarSourcesTab } from "./tabs/calendar-sources";
import { MainTab } from "./tabs/main";
import { OptionsTab } from "./tabs/options";

export const AppointmentsSettingsForm: React.FC<{
  values: BookingConfiguration;
}> = ({ values }) => {
  const form = useForm<BookingConfiguration>({
    resolver: zodResolver(bookingConfigurationSchema),
    mode: "all",
    reValidateMode: "onChange",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: BookingConfiguration) => {
    try {
      setLoading(true);
      await toastPromise(updateBookingConfiguration(data), {
        success: "Your changes were saved.",
        error: "There was a problem with your request.",
      });
      router.refresh();
    } catch (error: any) {
      console.error(error);
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
    form.trigger("calendarSources");
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
            <CalendarSourcesTab form={form} />
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
