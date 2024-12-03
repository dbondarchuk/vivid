import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import React from "react";
import { z } from "zod";
import { TabProps } from "./types";
import { StatusText } from "@/components/admin/appointments/types";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tagInput";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { templateSafeWithError } from "@/lib/string";
import { TextMessagesTemplateKeys } from "@/types";

const templateKeyText: Record<TextMessagesTemplateKeys, string> = {
  ...StatusText,
  rescheduled: "Rescheduled",
};

const TextMessagesTemplateForm: React.FC<
  TabProps & {
    type: TextMessagesTemplateKeys;
    whenText: string;
    demoArguments: Record<string, any>;
  }
> = ({ form, disabled, type, whenText, demoArguments }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-0 text-center">{templateKeyText[type]} SMS template</h3>
      <FormField
        control={form.control}
        name={`textMessages.templates.${type}.body`}
        render={({ field }) => (
          <ResizablePanelGroup direction="horizontal" className="max-md:hidden">
            <ResizablePanel className="pr-4">
              <FormItem>
                <FormLabel>
                  SMS body
                  <InfoTooltip>
                    <p>
                      Body of the SMS, that your customers will see when{" "}
                      {whenText}
                    </p>
                    <p>Leave empty to not to send SMS when {whenText}</p>
                    <p>* Uses templated values</p>
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={disabled}
                    placeholder="Body"
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
  );
};

export const TextMessagesTab: React.FC<
  TabProps & { demoArguments: Record<string, any> }
> = ({ form, disabled, demoArguments }) => {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
        <FormField
          control={form.control}
          name="textMessages.phoneField"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone field{" "}
                <InfoTooltip>
                  <p>
                    Name of the field which should be used for getting
                    customer&apos;s phone number.
                  </p>
                  <p>
                    <span className="italic">phone</span> is used by default
                  </p>
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  tagValidator={z
                    .string()
                    .min(1, "Field name must be at least 1 character")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <TextMessagesTemplateForm
        form={form}
        disabled={disabled}
        type={"pending"}
        whenText="they book new appointment"
        demoArguments={demoArguments}
      />
      <TextMessagesTemplateForm
        form={form}
        disabled={disabled}
        type={"confirmed"}
        whenText="the appointment was confirmed"
        demoArguments={demoArguments}
      />
      <TextMessagesTemplateForm
        form={form}
        disabled={disabled}
        type={"declined"}
        whenText="the appointment was declined"
        demoArguments={demoArguments}
      />
      <TextMessagesTemplateForm
        form={form}
        disabled={disabled}
        type={"rescheduled"}
        whenText="the appointment was rescheduled"
        demoArguments={demoArguments}
      />
    </div>
  );
};
