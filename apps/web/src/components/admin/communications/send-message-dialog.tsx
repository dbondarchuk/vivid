import { CommunicationChannelTexts } from "@/constants/labels";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailBuilder } from "@vivid/email-builder";
import {
  SendCommunicationRequest,
  sendCommunicationRequestSchema,
  Template,
} from "@vivid/types";
import {
  AlertModal,
  ArgumentsAutocomplete,
  Button,
  cn,
  Combobox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Label,
  ScrollArea,
  Spinner,
  TemplateSelector,
  toast,
  toastPromise,
  useArguments,
} from "@vivid/ui";
import { Send } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { TextMessageBuilder } from "../templates/text-message-builder";

export type SendCommunicationDialogProps = {
  children: React.ReactNode;
  onSuccess?: () => void;
} & (
  | {
      customerId: string;
    }
  | {
      appointmentId: string;
    }
);

export const SendCommunicationDialog: React.FC<
  SendCommunicationDialogProps
> = ({ children, onSuccess, ...rest }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = React.useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = React.useState(false);
  const [templateId, setTemplateId] = React.useState<string>();
  const [contentKey, setContentKey] = React.useState<string>();

  const [isCloseAlertModalOpen, setIsCloseAlertModalOpen] =
    React.useState(false);

  const onOpenChangeTemplateDialog = React.useCallback(
    (open: boolean) => {
      setIsTemplateDialogOpen(open);
      setTemplateId(undefined);
      setIsTemplateLoading(false);
    },
    [setIsTemplateDialogOpen, setIsTemplateLoading, setTemplateId]
  );

  const args = useArguments(rest);

  const form = useForm<SendCommunicationRequest>({
    resolver: zodResolver(sendCommunicationRequestSchema),
    mode: "all",
    defaultValues: {
      ...rest,
      content: null as any,
      channel: "text-message",
    } as Partial<SendCommunicationRequest> as SendCommunicationRequest,
  });

  const { setError, trigger } = form;
  const onEmailBuilderValidChange = React.useCallback(
    (isValid: boolean) =>
      isValid
        ? trigger()
        : setError("content", {
            message: "Content is not valid",
          }),
    [setError, trigger]
  );

  const close = () => {
    setIsCloseAlertModalOpen(false);
    setIsOpen(false);
    form.reset();
    setContentKey(new Date().getTime().toString());
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setIsCloseAlertModalOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const onSubmit = async (data: SendCommunicationRequest) => {
    try {
      setLoading(true);

      const promise = fetch("/admin/api/communications", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "applications/json",
        },
      });

      const result = await toastPromise(promise, {
        success: "Your message was successfully sent.",
        error: "There was a problem with your request.",
      });

      if (result.status >= 400) {
        throw new Error(result.statusText);
      }

      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onTemplateSelect = async () => {
    if (!templateId) return;

    try {
      setIsTemplateLoading(true);
      const response = await fetch(`/admin/api/templates/${templateId}`);
      if (response.status >= 400) {
        throw new Error(`Request failed: ${await response.text()}`);
      }

      const template = (await response.json()) as Template;
      if (template.type !== channel) {
        throw new Error("Wrong template type");
      }

      form.setValue("content", template.value);
      setIsTemplateDialogOpen(false);
      setContentKey(new Date().getTime().toString());
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast.error("There was a problem with your request.");
    } finally {
      setIsTemplateLoading(false);
    }
  };

  const channel = form.watch("channel");

  return (
    <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[80%] max-h-[100%]">
        <DialogHeader>
          <DialogTitle>Send new message</DialogTitle>
          <DialogDescription>
            Send a new email or text message to the customer
          </DialogDescription>
        </DialogHeader>
        <AlertModal
          onConfirm={close}
          isOpen={isCloseAlertModalOpen}
          onClose={() => setIsCloseAlertModalOpen(false)}
          description="You will loose all content if you close the dialog"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full relative grid grid-cols-1 gap-2 h-full"
          >
            <FormField
              control={form.control}
              name="channel"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Channel</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-2">
                      <Combobox
                        className="w-full"
                        values={Object.entries(CommunicationChannelTexts).map(
                          ([value, label]) => ({
                            label,
                            value,
                          })
                        )}
                        value={field.value}
                        onItemSelect={(val) => {
                          field.onChange(val);
                          field.onBlur();
                          form.setValue("content", null as any as string);
                        }}
                      />
                      <Dialog
                        open={isTemplateDialogOpen}
                        onOpenChange={onOpenChangeTemplateDialog}
                      >
                        <DialogTrigger asChild>
                          <Button variant="primary">Select template</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select template</DialogTitle>
                            <DialogDescription>
                              Select existing template
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-2">
                            <Label>Template</Label>
                            <TemplateSelector
                              type={channel}
                              value={templateId}
                              onItemSelect={setTemplateId}
                              className="w-full"
                            />
                            <FormDescription className="text-destructive">
                              <span className="font-bold">Attention!</span>{" "}
                              Selecting a template will replace your current
                              content.
                            </FormDescription>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="secondary">Close</Button>
                            </DialogClose>
                            <Button
                              variant="primary"
                              disabled={isTemplateLoading || !templateId}
                              onClick={onTemplateSelect}
                            >
                              {isTemplateLoading && <Spinner />}Select
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {channel === "email" && (
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email subject
                      <InfoTooltip>
                        <p>
                          Subject of the email, that your customers will see.
                        </p>
                        <p>* Uses templated values</p>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <ArgumentsAutocomplete
                        args={args}
                        asInput
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        disabled={loading}
                        placeholder="Subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <>
                  {channel === "email" && (
                    <ScrollArea
                      className={cn(
                        channel === "email" &&
                          "h-[55vh] [&>div>div[style]]:!block [&>div>div[style]]:h-full"
                      )}
                    >
                      <FormItem className="w-full flex-grow relative h-full">
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <EmailBuilder
                            args={args}
                            value={field.value as any}
                            onIsValidChange={onEmailBuilderValidChange}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            key={contentKey}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </ScrollArea>
                  )}
                  {channel === "text-message" && (
                    <TextMessageBuilder args={args} field={field} />
                  )}
                </>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button variant="primary" onClick={form.handleSubmit(onSubmit)}>
            {loading ? <Spinner /> : <Send />} Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
