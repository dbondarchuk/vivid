"use client";

import { Editor } from "@monaco-editor/react";
import { ComplexAppSetupProps, StatusText } from "@vivid/types";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  IFrame,
  InfoTooltip,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  useTheme,
} from "@vivid/ui";
import { templateSafeWithError } from "@vivid/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ConnectedAppStatusMessage } from "../../ui/connected-app-properties";
import { CustomerEmailNotificationApp } from "./app";
import {
  CustomerEmailNotificationConfiguration,
  customerEmailNotificationConfigurationSchema,
  EmailTemplateKeys,
} from "./models";

import { SaveButton } from "@vivid/ui";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { useDemoArguments } from "../../hooks/use-demo-arguments";
import confirmedTemplate from "./emails/appointment-confirmed.html";
import pendingTemplate from "./emails/appointment-created.html";
import declinedTemplate from "./emails/appointment-declined.html";
import rescheduledTemplate from "./emails/appointment-rescheduled.html";
import eventTemplate from "./emails/calendar-event.html";

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
  const { resolvedTheme } = useTheme();

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
                      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
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
  const { resolvedTheme } = useTheme();
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
                              theme={
                                resolvedTheme === "dark" ? "vs-dark" : "light"
                              }
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
