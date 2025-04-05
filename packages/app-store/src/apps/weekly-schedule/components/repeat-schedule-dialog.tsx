"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { WeekIdentifier } from "@vivid/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Checkbox,
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
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  Spinner,
  toastPromise,
  WeekSelector,
} from "@vivid/ui";
import { getWeekIdentifier } from "@vivid/utils";
import { Repeat2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { repeatWeeklySchedule } from "./actions";
import { getWeekDisplay } from "./utils";

type RepeatScheduleDialogProps = {
  appId: string;
  week: WeekIdentifier;
  disabled?: boolean;
  className?: string;
};

export const RepeatScheduleDialog: React.FC<RepeatScheduleDialogProps> = ({
  appId,
  week,
  disabled,
  className,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const todayWeek = getWeekIdentifier(new Date());

  const repeatScheduleFormSchema = z.object({
    interval: z.coerce
      .number()
      .int("Should be the integer value")
      .min(1, "Schedule must be repeated with at least one week interval"),
    maxWeek: z.coerce.number().min(todayWeek, "Should be past current week"),
    replaceExisting: z.coerce.boolean().optional().nullable(),
  });

  type RepeatScheduleForm = z.infer<typeof repeatScheduleFormSchema>;

  const form = useForm<RepeatScheduleForm>({
    resolver: zodResolver(repeatScheduleFormSchema),
    mode: "all",
    values: {
      interval: 1,
      maxWeek: todayWeek + 3 * 52, /// ~ 3 year
      replaceExisting: false,
    },
  });

  const router = useRouter();

  const onConfirm = async () => {
    const data = repeatScheduleFormSchema.parse(form.getValues());
    try {
      setLoading(true);
      await toastPromise(
        repeatWeeklySchedule(
          appId,
          week,
          data.interval,
          data.maxWeek,
          data.replaceExisting ?? false
        ),
        {
          success: `Schedule for week of ${getWeekDisplay(week)} was successfully copied for every ${data.interval}-nd week until ${getWeekDisplay(data.maxWeek)}`,
          error: "There was a problem with your request.",
        }
      );

      setOpenConfirmDialog(false);
      setOpenDialog(false);

      router.refresh();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: RepeatScheduleForm) => {
    setOpenConfirmDialog(true);
  };

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>
        <Button variant="primary" disabled={disabled} className={className}>
          <Repeat2 /> Repeat schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[100%] translate-y-[-100%]">
        <DialogHeader>
          <DialogTitle className="w-full flex flex-row justify-between items-center mt-2">
            Repeat weekly schedule
          </DialogTitle>
          <DialogDescription>
            Copy this weekly schedule with interval
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-2 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 relative"
            >
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat every</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput>
                          <Input
                            disabled={disabled}
                            placeholder="2"
                            type="number"
                            className={InputGroupInputClasses()}
                            {...field}
                          />
                        </InputGroupInput>
                        <InputSuffix className={InputGroupSuffixClasses()}>
                          weeks
                        </InputSuffix>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Repeat until{" "}
                      <InfoTooltip>
                        The latest week (including) up to which to repeat the
                        schedule
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <WeekSelector
                        minWeek={todayWeek}
                        initialWeek={field.value}
                        onWeekChange={(w) => {
                          field.onChange(w);
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="replaceExisting"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox
                        id="confirm-overlap"
                        checked={field.value ?? false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          field.onBlur();
                        }}
                      />
                      <FormLabel
                        htmlFor="confirm-overlap"
                        className="cursor-pointer"
                      >
                        Replace existing
                      </FormLabel>
                    </div>
                    <FormDescription>
                      If checked, this will replace existing schedules for weeks
                      that fall into the repeated weeks
                    </FormDescription>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="!justify-between flex-row gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <AlertDialog
            open={openConfirmDialog}
            onOpenChange={setOpenConfirmDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="default" disabled={!form.formState.isValid}>
                Copy
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will repeat the schedule
                  for the week {getWeekDisplay(week)} ever{" "}
                  {form.getValues("interval")} weeks until the week of{" "}
                  {getWeekDisplay(form.getValues("maxWeek"))}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={loading}
                  className="flex flex-row gap-1 items-center"
                  onClick={() => onConfirm()}
                >
                  {loading && <Spinner />} <span>Copy</span>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
