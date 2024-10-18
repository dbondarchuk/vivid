import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment, Event } from "@/types";
import { DialogProps } from "@radix-ui/react-dialog";
import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DateTime } from "luxon";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { rescheduleAppointment } from "./actions";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { AppointmentCalendar } from "./appointment.calendar";
import { DateTimePicker } from "@/components/ui/time-picker/date-time-picker";
import {
  InputGroup,
  InputGroupInput,
  InputSuffix,
} from "@/components/ui/inputGroup";
import {
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "../forms/inputGroupClasses";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";

export type AppointmentRescheduleDialogProps = DialogProps & {
  appointment: Appointment;
  trigger?: React.ReactNode;
  onRescheduled?: (props: { dateTime: Date; duration: number }) => void;
};

const formSchema = z.object({
  dateTime: z.date({ message: "New date and time are required" }),
  duration: z.coerce
    .number({ message: "New duration is required" })
    .min(1, "Minimum duration is 1")
    .max(60 * 24 * 10, "Maximum duration is 10 days"),
});

type FormValues = z.infer<typeof formSchema>;

export const AppointmentRescheduleDialog: React.FC<
  AppointmentRescheduleDialogProps
> = ({ appointment: propAppointment, trigger, onRescheduled, ...rest }) => {
  const [appointment, setAppointment] =
    React.useState<Appointment>(propAppointment);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    values: {
      dateTime: propAppointment.dateTime,
      duration: propAppointment.totalDuration,
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [confirmOverlap, setConfirmOverlap] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [calendarEvents, setCalendarEvents] = React.useState<Event[]>([]);

  const isOpen = rest.open;

  React.useEffect(() => {
    setOpenDialog(!!isOpen);
  }, [isOpen]);

  const openCloseDialog = (open: boolean) => {
    setOpenDialog(open);
    rest.onOpenChange?.(open);
  };

  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await rescheduleAppointment(
        appointment._id,
        data.dateTime,
        data.duration
      );

      router.refresh();
      toast({
        variant: "default",
        title: "Rescheduled",
        description: "Appointment was succesfully rescheduled",
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

  const isOverlaping = React.useMemo(() => {
    const appointmentStart = DateTime.fromJSDate(appointment.dateTime);
    const appointmentEnd = appointmentStart.plus({
      minutes: appointment.totalDuration,
    });

    return calendarEvents.some((app) => {
      if ((app as Appointment)._id === appointment._id) return false;
      const appStart = DateTime.fromJSDate(app.dateTime);
      const appEnd = appStart.plus({ minutes: app.totalDuration });

      return (
        (appStart > appointmentStart && appStart < appointmentEnd) ||
        (appointmentStart > appStart && appointmentStart < appEnd)
      );
    });
  }, [appointment, calendarEvents]);

  const { isValid } = useFormState(form);

  const dateTime = form.watch("dateTime");
  const duration = form.watch("duration");
  React.useEffect(() => {
    setAppointment((prev) => ({
      ...prev,
      dateTime,
      totalDuration: duration,
    }));

    setConfirmOverlap(false);
  }, [dateTime, duration, setAppointment, setConfirmOverlap]);

  const reschedule = async () => {
    if (isOverlaping && !confirmOverlap) return;

    await form.handleSubmit(onSubmit)();
    onRescheduled?.(form.getValues());

    setOpenConfirmDialog(false);
    openCloseDialog(false);
  };

  return (
    <Dialog {...rest} open={openDialog} onOpenChange={openCloseDialog}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[80%] flex flex-col max-h-[100%]">
            <DialogHeader>
              <DialogTitle className="w-full flex flex-row justify-between items-center mt-2">
                Reschedule the appointment
              </DialogTitle>
              <DialogDescription>
                {appointment.option.name} by {appointment.fields.name}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 w-full overflow-auto">
              <div className="flex flex-col gap-4 w-full">
                <div className="md:grid grid-cols-2">
                  <div className="w-full space-y-8 relative px-1 content-center">
                    <FormField
                      control={form.control}
                      name="dateTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DateTime</FormLabel>
                          <FormControl>
                            <DateTimePicker
                              disabled={loading}
                              fromDate={new Date()}
                              {...field}
                              className="flex w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <InputGroup>
                              <InputGroupInput>
                                <Input
                                  disabled={loading}
                                  placeholder="30"
                                  type="number"
                                  className={InputGroupInputClasses()}
                                  {...field}
                                />
                              </InputGroupInput>
                              <InputSuffix
                                className={InputGroupSuffixClasses()}
                              >
                                minutes
                              </InputSuffix>
                            </InputGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isOverlaping && (
                      <FormItem>
                        <div className="flex flex-row items-center gap-2">
                          <Checkbox
                            id="confirm-overlap"
                            disabled={loading}
                            checked={confirmOverlap}
                            onCheckedChange={(e) => setConfirmOverlap(!!e)}
                          />
                          <FormLabel
                            htmlFor="confirm-overlap"
                            className="cursor-pointer"
                          >
                            Confirm overlap
                          </FormLabel>
                        </div>
                        <FormDescription>
                          I understand that rescheduling this appointment will
                          create an overlap in my schedule
                        </FormDescription>
                      </FormItem>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <AppointmentCalendar
                      appointment={appointment}
                      onEventsLoad={setCalendarEvents}
                    />
                  </div>
                </div>
              </div>
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
                  <Button
                    variant="default"
                    disabled={!isValid || (isOverlaping && !confirmOverlap)}
                  >
                    Reschedule
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will reschedule this
                      appointment and will notify the customer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      disabled={loading}
                      onClick={reschedule}
                      className="flex flex-row gap-1 items-center"
                    >
                      {loading && <Spinner />} <span>Reschedule</span>
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};
