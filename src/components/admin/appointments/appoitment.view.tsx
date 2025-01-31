"use client";

import { AppointmentActionButton } from "@/components/admin/appointments/action.button";
import { updatAppointmentNote } from "@/components/admin/appointments/actions";
import { AppointmentCalendar } from "@/components/admin/appointments/appointment.calendar";
import { StatusText } from "@/components/admin/appointments/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Appointment, AppointmentStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTimeZones } from "@vvo/tzdb";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import { AppointmentRescheduleDialog } from "./appointment.reschedule.dialog";
import { Markdown } from "@/components/web/markdown/Markdown";
import { durationToTime } from "@/lib/time";
import { Link } from "@/components/ui/link";
import {
  CalendarCheck2,
  CalendarPlus,
  CalendarSearch,
  CalendarSync,
  CalendarX,
  CalendarX2,
} from "lucide-react";
import { ButtonGroup } from "@/components/ui/buttonGroup";

const timezones = getTimeZones();

const noteFormSchema = z.object({
  note: z.string().optional(),
});

type NoteFormSchema = z.infer<typeof noteFormSchema>;

export const AppointmentView: React.FC<{ appointment: Appointment }> = ({
  appointment: propAppointment,
}) => {
  const router = useRouter();

  const [appointment, setAppointment] = React.useState(propAppointment);

  const noteForm = useForm<NoteFormSchema>({
    resolver: zodResolver(noteFormSchema),
    mode: "all",
    values: {
      note: appointment.note,
    },
  });

  const [loading, setLoading] = React.useState(false);

  const onNoteSubmit = async (data: NoteFormSchema) => {
    try {
      setLoading(true);
      await updatAppointmentNote(appointment._id, data.note);
      router.refresh();
      toast({
        variant: "default",
        title: "Saved",
        description: "Your changes were saved.",
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

  const { name, email, ...restFields } = appointment.fields;

  const reschedule = ({
    dateTime,
    duration,
  }: {
    dateTime: Date;
    duration: number;
  }) => {
    setAppointment((prev) => ({
      ...prev,
      dateTime,
      totalDuration: duration,
    }));
  };

  const updateStatus = (newStatus: AppointmentStatus) => {
    setAppointment((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const duration = durationToTime(appointment.totalDuration);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row justify-end gap-2 flex-wrap">
        <Link
          className="inline-flex flex-row gap-2 items-center"
          variant="primary"
          button
          href={`/admin/dashboard/appointments/new?from=${appointment._id}`}
        >
          <CalendarSync size={20} /> Schedule again
        </Link>

        {appointment.status !== "declined" ? (
          <>
            <AppointmentRescheduleDialog
              appointment={appointment}
              onRescheduled={reschedule}
              trigger={
                <Button
                  variant="primary"
                  className="inline-flex flex-row gap-2 items-center"
                >
                  <CalendarSearch size={20} />
                  Reschedule
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="inline-flex flex-row gap-2 items-center"
                >
                  <CalendarX2 size={20} /> Decline
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently decline
                    this appointment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <AppointmentActionButton
                      variant="destructive"
                      _id={appointment._id}
                      status="declined"
                      onSuccess={updateStatus}
                    >
                      <CalendarX2 size={20} />
                      Decline
                    </AppointmentActionButton>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}

        {appointment.status === "pending" ? (
          <AppointmentActionButton
            variant="default"
            _id={appointment._id}
            status="confirmed"
            className="gap-2"
            onSuccess={updateStatus}
          >
            <CalendarCheck2 size={20} /> Confirm
          </AppointmentActionButton>
        ) : null}
      </div>
      <div className="flex flex-col lg:grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <dl className="divide-y">
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Date &amp; Time:</dt>
              <dd className="col-span-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="dateTime" className="border-none">
                    <AccordionTrigger>
                      {DateTime.fromJSDate(appointment.dateTime).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY
                      )}{" "}
                      -{" "}
                      {DateTime.fromJSDate(appointment.dateTime)
                        .plus({ minutes: appointment.totalDuration })
                        .toLocaleString(DateTime.TIME_SIMPLE)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-1">
                        <div>Date and time:</div>
                        <div>
                          {DateTime.fromJSDate(
                            appointment.dateTime
                          ).toLocaleString(
                            DateTime.DATETIME_MED_WITH_WEEKDAY
                          )}{" "}
                        </div>
                        <div>Duration:</div>
                        <div>
                          {duration.hours > 0 && <>{duration.hours} hours</>}
                          {duration.hours > 0 && duration.minutes > 0 && <> </>}
                          {duration.minutes > 0 && (
                            <>{duration.minutes} minutes</>
                          )}
                        </div>
                        <div>Timezone:</div>
                        <div>
                          {
                            timezones.find(
                              (tz) => tz.name === appointment.timeZone
                            )?.currentTimeFormat
                          }{" "}
                          <span className="text-sm text-muted-foreground">
                            ({appointment.timeZone})
                          </span>
                        </div>
                        <div>Ends at:</div>
                        <div>
                          {DateTime.fromJSDate(appointment.dateTime)
                            .plus({ minutes: appointment.totalDuration })
                            .toLocaleString(
                              DateTime.DATETIME_MED_WITH_WEEKDAY
                            )}{" "}
                        </div>
                        <div>Requested at:</div>
                        <div>
                          {DateTime.fromJSDate(
                            appointment.createdAt
                          ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
                        </div>
                      </div>
                      {appointment.status !== "declined" && (
                        <AppointmentRescheduleDialog
                          appointment={appointment}
                          onRescheduled={reschedule}
                          trigger={
                            <Button variant={"default"}>Reschedule</Button>
                          }
                        />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </dd>
            </div>
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Status</dt>
              <dd className="col-span-2">{StatusText[appointment.status]}</dd>
            </div>
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Customer</dt>
              <dd className="col-span-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="option" className="border-none">
                    <AccordionTrigger>
                      <span>
                        {name}{" "}
                        <span className="text-sm text-muted-foreground">
                          ({email})
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-3 gap-1">
                        <div>Name:</div>
                        <div className="col-span-2">
                          <Link
                            variant="default"
                            href={`/admin/dashboard/appointments?search=${encodeURIComponent(
                              name
                            )}`}
                          >
                            {name}
                          </Link>
                        </div>
                        <div>Email:</div>
                        <div className="col-span-2">
                          <Link
                            variant="default"
                            href={`/admin/dashboard/appointments?search=${encodeURIComponent(
                              email
                            )}`}
                          >
                            {email}
                          </Link>
                        </div>
                        {Object.entries(restFields).map(([key, value]) => (
                          <React.Fragment key={key}>
                            <div>
                              {appointment.option?.fields?.[key] ? (
                                <>
                                  <span>
                                    {appointment.option?.fields?.[key]}
                                  </span>{" "}
                                  <span className="text-sm text-muted-foreground">
                                    ({key})
                                  </span>
                                </>
                              ) : (
                                key
                              )}
                              :
                            </div>
                            <div className="col-span-2">
                              <Link
                                variant="default"
                                href={`/admin/dashboard/appointments?search=${encodeURIComponent(
                                  value
                                )}`}
                              >
                                {value.toString()}
                              </Link>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </dd>
            </div>
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Selected option</dt>
              <dd className="col-span-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="option" className="border-none">
                    <AccordionTrigger>
                      {appointment.option.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-3 gap-1">
                        {!!appointment.option.duration && (
                          <>
                            <div>Duration:</div>
                            <div className="col-span-2">
                              {appointment.option.duration} minutes
                            </div>
                          </>
                        )}
                        {!!appointment.option.price && (
                          <>
                            <div>Price:</div>
                            <div className="col-span-2">
                              ${appointment.option.price}
                            </div>
                          </>
                        )}
                        <div>Description:</div>
                        <div className="col-span-2">
                          <Markdown markdown={appointment.option.description} />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </dd>
            </div>
            {appointment.addons && appointment.addons.length > 0 && (
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="flex self-center">Selected addons:</dt>
                <dd className="col-span-2">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="addons" className="border-none">
                      <AccordionTrigger>
                        {appointment.addons
                          .map((addon) => addon.name)
                          .join(", ")}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul>
                          {appointment.addons.map((addon, index) => (
                            <li key={index}>
                              {addon.name}
                              {(addon.price || addon.duration) && (
                                <ul className="pl-2">
                                  {!!addon.duration && (
                                    <li>Duration: {addon.duration} min</li>
                                  )}
                                  {!!addon.price && (
                                    <li>Price: ${addon.price}</li>
                                  )}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </dd>
              </div>
            )}

            {appointment.totalPrice && (
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt>Price:</dt>
                <dd className="col-span-2">${appointment.totalPrice}</dd>
              </div>
            )}
          </dl>

          <Form {...noteForm}>
            <form
              onSubmit={noteForm.handleSubmit(onNoteSubmit)}
              onBlur={noteForm.handleSubmit(onNoteSubmit)}
              className="flex flex-col gap-1"
            >
              <div className="font-semibold flex flex-row gap-1 items-center">
                Note:{" "}
              </div>
              <FormField
                control={noteForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Note"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className="flex flex-col gap-2">
          <AppointmentCalendar appointment={appointment} />
        </div>
      </div>
    </div>
  );
};
