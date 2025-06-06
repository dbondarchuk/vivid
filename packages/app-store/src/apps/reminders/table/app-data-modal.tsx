import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Skeleton,
  Spinner,
  TemplateSelector,
  toast,
  toastPromise,
} from "@vivid/ui";
import { Cog } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { getAppData, setAppData } from "../actions";
import { RemindersAppData, remindersAppDataSchema } from "../models";

export const AppDataModal: React.FC<{ appId: string }> = ({ appId }) => {
  const [initialValue, setInitialValue] = React.useState<
    RemindersAppData | undefined
  >();

  const [open, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<RemindersAppData>({
    resolver: zodResolver(remindersAppDataSchema),
    mode: "all",
    reValidateMode: "onChange",
    values: initialValue,
  });

  const getAppDataFn = async () => {
    try {
      setIsLoading(true);
      setInitialValue(await getAppData(appId));
    } catch (e) {
      console.error(e);
      toast.error("Your request has failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      getAppDataFn();
    }

    setIsOpen(open);
  };

  const onSubmit = async (data: RemindersAppData) => {
    try {
      setIsLoading(true);

      await toastPromise(setAppData(appId, data), {
        success: "Settings were successfully saved.",
        error: "There was a problem with your request.",
      });

      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Cog /> <span className="max-md:hidden">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reminders settings</DialogTitle>
          <DialogDescription>Update Reminders app settings</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col gap-2">
              <FormField
                control={form.control}
                name="textMessageAutoReplyTemplateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Text message auto reply
                      <InfoTooltip>
                        <p>
                          Can be used for notifying the user that they should
                          not reply to text message
                        </p>
                        <p>Optional</p>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      {isLoading ? (
                        <Skeleton className="w-full h-10" />
                      ) : (
                        <TemplateSelector
                          type="text-message"
                          disabled={isLoading}
                          value={field.value}
                          onItemSelect={(value) => field.onChange(value)}
                          allowClear
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading && <Spinner />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
