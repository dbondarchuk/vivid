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
import { z } from "zod";
import { TabProps } from "./types";
import { AppointmentStatus, appointmentStatuses } from "@/types";
import { StatusText } from "@/components/admin/appointments/types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IFrame } from "@/components/ui/iframe";

const emailTemplateSchema = z.object({
  subject: z
    .string({ message: "Email subject template is required" })
    .min(1, "Email subject template is required"),
  body: z
    .string({ message: "Email body template is required" })
    .min(1, "Email body template is required"),
});

export const emailTabFormSchema = z.object({
  to: z.string().email("Must be a valid email"),
  from: z.string().email("Must be a valid email"),
  templates: z
    .record(z.enum(appointmentStatuses), emailTemplateSchema)
    .refine((obj): obj is Required<typeof obj> =>
      appointmentStatuses.every((key) => !!obj[key])
    ),
  // templates: z.object({
  //   pending: emailTemplateSchema,
  //   confirmed: emailTemplateSchema,
  //   declined: emailTemplateSchema,
  // }),
  event: z.object({
    summary: z
      .string({ message: "Event summary template is required" })
      .min(1, "Event summary template is required"),
    description: z
      .string({ message: "Event description template is required" })
      .min(1, "Event description template is required"),
  }),
});

const EmailTemplateForm: React.FC<
  TabProps & {
    status: AppointmentStatus;
    whenText: string;
  }
> = ({ form, disabled, status, whenText }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-0 text-center">{StatusText[status]} email template</h3>
      <FormField
        control={form.control}
        name={`email.templates.${status}.subject`}
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
        name={`email.templates.${status}.body`}
        render={({ field }) => (
          <ResizablePanelGroup direction="horizontal" className="max-md:hidden">
            <ResizablePanel className="pr-1">
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
            <ResizablePanel className="pl-1">
              <FormItem>
                <FormLabel>Preview</FormLabel>
                <IFrame className="h-[60vh] w-full">
                  <ScrollArea className="h-[60vh] w-full">
                    <div dangerouslySetInnerHTML={{ __html: field.value }} />
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

export const EmailTab: React.FC<TabProps> = ({ form, disabled }) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="gap-8 md:grid md:grid-cols-2">
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
        status={"pending"}
        whenText="they book new appointment"
      />
      <EmailTemplateForm
        form={form}
        disabled={disabled}
        status={"confirmed"}
        whenText="the appointment was confirmed"
      />
      <EmailTemplateForm
        form={form}
        disabled={disabled}
        status={"declined"}
        whenText="the appointment was declined"
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
                      <div dangerouslySetInnerHTML={{ __html: field.value }} />
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
