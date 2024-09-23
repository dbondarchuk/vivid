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
import { Appointment } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTimeZones } from "@vvo/tzdb";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import { AppointmentRescheduleDialog } from "./appointment.reschedule.dialog";
import { Markdown } from "@/components/web/markdown/Markdown";

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

  return (
    <div className="flex flex-col gap-4 w-full">
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
                        <div>{appointment.totalDuration} minutes</div>
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
                      <div className="grid grid-cols-2 gap-1">
                        <div>Name:</div>
                        <div>{name}</div>
                        <div>Email:</div>
                        <div>{email}</div>
                        {Object.entries(restFields).map(([key, value]) => (
                          <React.Fragment key={key}>
                            <div>{key}:</div>
                            <div>{value}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </dd>
            </div>
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Status</dt>
              <dd className="col-span-2">
                {appointment.status !== "declined" ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="option" className="border-none">
                      <AccordionTrigger>
                        {StatusText[appointment.status]}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col sm:flex-row gap-1 justify-between">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="secondary">Decline</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently decline this appointment and will
                                  notify the customer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <AppointmentActionButton
                                    variant="secondary"
                                    _id={appointment._id}
                                    status="declined"
                                  >
                                    Decline
                                  </AppointmentActionButton>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          {appointment.status === "pending" && (
                            <AppointmentActionButton
                              variant="default"
                              size="sm"
                              _id={appointment._id}
                              status="confirmed"
                            >
                              Confirm
                            </AppointmentActionButton>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  StatusText["declined"]
                )}
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
                      <div className="grid grid-cols-2 gap-1">
                        {appointment.option.duration && (
                          <>
                            <div>Duration:</div>
                            <div>{appointment.option.duration} minutes</div>
                          </>
                        )}
                        {appointment.option.price && (
                          <>
                            <div>Price:</div>
                            <div>${appointment.option.price}</div>
                          </>
                        )}
                        <div>Description:</div>
                        <div>
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
                                  {addon.duration && (
                                    <li>Duration: {addon.duration} min</li>
                                  )}
                                  {addon.price && (
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
            {/* {appointment.totalDuration && (
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt>Duration:</dt>
                <dd className="col-span-2">{appointment.totalDuration} min</dd>
              </div>
            )} */}

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
                    {/* <FormLabel>Note</FormLabel> */}
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
