import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Editor from "@monaco-editor/react";
import React from "react";
import { TabProps } from "./types";
import { StatusText } from "@/components/admin/appointments/types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IFrame } from "@/components/ui/iframe";
import { templateSafeWithError } from "@/lib/string";
import { EmailTemplateKeys } from "@/types";

const templateKeyText: Record<EmailTemplateKeys, string> = {
  ...StatusText,
  rescheduled: "Rescheduled",
};

const EmailTemplateForm: React.FC<
  TabProps & {
    type: EmailTemplateKeys;
    whenText: string;
    demoArguments: Record<string, any>;
  }
> = ({ form, disabled, type, whenText, demoArguments }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-0 text-center">
        {templateKeyText[type]} email template
      </h3>
      <FormField
        control={form.control}
        name={`email.templates.${type}.subject`}
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
        name={`email.templates.${type}.body`}
        render={({ field }) => (
          <ResizablePanelGroup direction="horizontal" className="max-md:hidden">
            <ResizablePanel className="pr-4">
              <FormItem>
                <FormLabel>
                  Email body
                  <InfoTooltip>
                    <p>
                      Body of the email, that your customers will see when{" "}
                      {whenText}
                    </p>
                    <p>* Uses templated values</p>
                  </InfoTooltip>
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
        )}
      />
    </div>
  );
};

export const EmailTab: React.FC<
  TabProps & { demoArguments: Record<string, any> }
> = ({ form, disabled, demoArguments }) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
        <FormField
          control={form.control}
          name="email.from"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Sender email{" "}
                <InfoTooltip>
                  Email address from which emails will be sent
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email.to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your email
                <InfoTooltip>
                  <p>Email address to which send your own emails.</p>
                  <p>For example, notifications about new appointments.</p>
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <EmailTemplateForm
        form={form}
        disabled={disabled}
        type={"pending"}
        whenText="they book new appointment"
        demoArguments={demoArguments}
      />
      <EmailTemplateForm
        form={form}
        disabled={disabled}
        type={"confirmed"}
        whenText="the appointment was confirmed"
        demoArguments={demoArguments}
      />
      <EmailTemplateForm
        form={form}
        disabled={disabled}
        type={"declined"}
        whenText="the appointment was declined"
        demoArguments={demoArguments}
      />
      <EmailTemplateForm
        form={form}
        disabled={disabled}
        type={"rescheduled"}
        whenText="the appointment was rescheduled"
        demoArguments={demoArguments}
      />
      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-center">Calendar event template</h3>
        <FormField
          control={form.control}
          name="email.event.summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event summary
                <InfoTooltip>
                  <p>
                    Summary of the event, that your customers will see in their
                    calendar
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
          name="email.event.description"
          render={({ field }) => (
            <ResizablePanelGroup
              direction="horizontal"
              className="max-md:hidden"
            >
              <ResizablePanel className="pr-1">
                <FormItem>
                  <FormLabel>
                    Event content
                    <InfoTooltip>
                      <p>
                        Content of the event, that your customers will see when
                        in their calendar
                      </p>
                      <p>* Uses templated values</p>
                    </InfoTooltip>
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
          )}
        />
      </div>
    </div>
  );
};
