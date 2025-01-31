"use client";

import { ComplexAppSetupProps, ConnectedAppStatusWithText } from "@/types";
import React from "react";
import {
  addNewApp,
  getAppData,
  getDemoArguments,
  processRequest,
} from "../apps.actions";
import { Button } from "@/components/ui/button";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { CustomerEmailNotificationApp } from "./customerEmailNotification.app";
import {
  CustomerEmailNotificationConfiguration,
  customerEmailNotificationConfigurationSchema,
  EmailTemplateKeys,
} from "./customerEmailNotification.models";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "@/components/admin/apps/connectedAppProperties";
import { StatusText } from "@/components/admin/appointments/types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Editor } from "@monaco-editor/react";
import { IFrame } from "@/components/ui/iframe";
import { ScrollArea } from "@/components/ui/scroll-area";
import { templateSafeWithError } from "@/lib/string";

import confirmedTemplate from "./emails/appointmentConfirmed.html";
import pendingTemplate from "./emails/appointmentCreated.html";
import declinedTemplate from "./emails/appointmentDeclined.html";
import rescheduledTemplate from "./emails/appointmentRescheduled.html";
import eventTemplate from "./emails/calendarEvent.html";
import { SaveButton } from "@/components/admin/forms/save-button";
import { useDemoArguments } from "@/hooks/useDemoArguments";
import { useConnectedAppSetup } from "@/hooks/useConnectedAppSetup";

const defaultTemplates: Record<EmailTemplateKeys | "event", string> = {
  confirmed: confirmedTemplate,
  declined: declinedTemplate,
  pending: pendingTemplate,
  rescheduled: rescheduledTemplate,
  event: eventTemplate,
};

const templateKeyText: Record<EmailTemplateKeys, string> = {
  ...StatusText,
  rescheduled: "Rescheduled",
};

const EmailTemplateForm: React.FC<{
  form: UseFormReturn<CustomerEmailNotificationConfiguration>;
  disabled?: boolean;
  type: EmailTemplateKeys;
  whenText: string;
  demoArguments: Record<string, any>;
}> = ({ form, disabled, type, whenText, demoArguments }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="m-0 text-center">
        {templateKeyText[type]} email template
      </h3>
      <FormField
        control={form.control}
        name={`templates.${type}.subject`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Email subject
              <InfoTooltip>
                <p>
                  Subject of the email, that your customers will see when{" "}
                  {whenText}
                </p>
                <p>* Uses templated values</p>
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <Input disabled={disabled} placeholder="Subject" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`templates.${type}.body`}
        render={({ field }) => (
          <>
            <ResizablePanelGroup
              direction="horizontal"
              className="max-md:hidden"
            >
              <ResizablePanel className="pr-4">
                <FormItem>
                  <FormLabel className="flex flex-row items-center justify-between">
                    <span>
                      Email body
                      <InfoTooltip>
                        <p>
                          Body of the email, that your customers will see when{" "}
                          {whenText}
                        </p>
                        <p>* Uses templated values</p>
                      </InfoTooltip>
                    </span>
                    <Button
                      variant="link"
                      type="button"
                      className="px-0 text-xs text-muted-foreground decoration-dashed underline hover:no-underline"
                      onClick={() => field.onChange(defaultTemplates[type])}
                    >
                      Use default template
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <Editor
                      height="60vh"
                      language="html"
                      theme="vs-dark"
                      value={field.value}
                      onChange={field.onChange}
                      onValidate={() => form.trigger(field.name)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel className="pl-4">
                <FormItem>
                  <FormLabel>Preview</FormLabel>
                  <IFrame className="h-[60vh] w-full">
                    <ScrollArea className="h-[60vh] w-full">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: templateSafeWithError(
                            field.value,
                            demoArguments
                          ),
                        }}
                      />
                    </ScrollArea>
                  </IFrame>
                </FormItem>
              </ResizablePanel>
            </ResizablePanelGroup>
          </>
        )}
      />
    </div>
  );
};

export const CustomerEmailNotificationAppSetup: React.FC<
  ComplexAppSetupProps
> = ({ appId }) => {
  const demoArguments = useDemoArguments();
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<CustomerEmailNotificationConfiguration>({
      appId,
      appName: CustomerEmailNotificationApp.name,
      schema: customerEmailNotificationConfigurationSchema,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4">
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              type={"pending"}
              whenText="they book new appointment"
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              type={"confirmed"}
              whenText="the appointment was confirmed"
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              type={"declined"}
              whenText="the appointment was declined"
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              type={"rescheduled"}
              whenText="the appointment was rescheduled"
              demoArguments={demoArguments}
            />
            <div className="flex flex-col gap-2 w-full">
              <h3 className="m-0 text-center">Calendar event template</h3>
              <FormField
                control={form.control}
                name="event.summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Event summary
                      <InfoTooltip>
                        <p>
                          Summary of the event, that your customers will see in
                          their calendar
                        </p>
                        <p>* Uses templated values</p>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Subject"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event.description"
                render={({ field }) => (
                  <>
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="max-md:hidden"
                    >
                      <ResizablePanel className="pr-1">
                        <FormItem>
                          <FormLabel className="flex flex-row items-center justify-between">
                            <span>
                              Event content
                              <InfoTooltip>
                                <p>
                                  Content of the event, that your customers will
                                  see when in their calendar
                                </p>
                                <p>* Uses templated values</p>
                              </InfoTooltip>
                            </span>
                            <Button
                              variant="link"
                              type="button"
                              className="px-0 text-xs text-muted-foreground decoration-dashed underline hover:no-underline"
                              onClick={() =>
                                field.onChange(defaultTemplates.event)
                              }
                            >
                              Use default template
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <Editor
                              height="60vh"
                              language="html"
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              onValidate={() => form.trigger(field.name)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </ResizablePanel>
                      <ResizableHandle withHandle />
                      <ResizablePanel className="pl-1">
                        <FormItem>
                          <FormLabel>Preview</FormLabel>
                          <IFrame className="h-[60vh] w-full">
                            <ScrollArea className="h-[60vh] w-full">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: templateSafeWithError(
                                    field.value,
                                    demoArguments
                                  ),
                                }}
                              />
                            </ScrollArea>
                          </IFrame>
                        </FormItem>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </>
                )}
              />
            </div>
            <SaveButton
              form={form}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
