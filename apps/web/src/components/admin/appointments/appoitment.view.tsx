"use client";

import Image from "next/image";
import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";

import { AppointmentActionButton } from "@/components/admin/appointments/action.button";
import {
  removeAppointmentFile,
  updateAppointmentNote,
} from "@/components/admin/appointments/actions";
import { AppointmentCalendar } from "@/components/admin/appointments/appointment.calendar";
import { Markdown } from "@/components/web/markdown";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Appointment,
  AppointmentStatus,
  Asset,
  StatusText,
} from "@vivid/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  FileInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Link,
  Textarea,
  toast,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { getTimeZones } from "@vvo/tzdb";
import {
  CalendarCheck2,
  CalendarSearch,
  CalendarSync,
  CalendarX2,
  Trash,
} from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppointmentRescheduleDialog } from "./appointment.reschedule.dialog";
import { AppointmentAddFile } from "./appointment.addFile";
import mimeType from "mime-type/with-db";
import { DialogTitle } from "@radix-ui/react-dialog";

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
      await updateAppointmentNote(appointment._id, data.note);
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

  const onRemoveAppointmentFile = async (fileId: string) => {
    try {
      setLoading(true);
      await removeAppointmentFile(appointment._id, fileId);

      const fileIndex =
        appointment.files?.findIndex((file) => file._id === fileId) ?? -1;
      if (fileIndex >= 0) {
        appointment.files?.splice(fileIndex, 1);
      }

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

  const onAssetsAdded = (assets: Asset[]) => {
    if (!appointment.files) {
      appointment.files = [];
    }

    appointment.files.push(...assets);
    router.refresh();
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

  const galleryItems =
    appointment.files?.filter((file) => file.mimeType?.startsWith("image/")) ||
    [];

  const [galleryOpen, setGalleryOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<string | undefined>();
  const [api, setApi] = React.useState<CarouselApi>();

  const onFileClick = (fileId: string) => {
    setSelectedFile(fileId);
    setGalleryOpen(true);
  };

  React.useEffect(() => {
    if (!api || !selectedFile || !galleryOpen) return;
    const index = galleryItems.findIndex((item) => item._id === selectedFile);
    if (index < 0) return;

    api.scrollTo(index, true);
  }, [api, selectedFile, galleryOpen]);

  const onGalleryOpenChange = (open: boolean) => {
    if (!open) setSelectedFile(undefined);
    setGalleryOpen(open);
  };

  const mimeTypeToExtension = (fileType: string) =>
    (mimeType.extension(fileType) || "bin") as string;

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
                          <Markdown
                            markdown={appointment.option.description}
                            notProse
                          />
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
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Files</dt>
              <dd className="col-span-2 flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <AppointmentAddFile
                    appointmentId={appointment._id}
                    onSuccess={onAssetsAdded}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {appointment.files?.map((file) => (
                      <div className="w-full relative flex justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              disabled={loading}
                              variant="ghost"
                              className="absolute -right-1 -top-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              size="icon"
                              type="button"
                              title="Remove appointment file"
                            >
                              <Trash size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure that you want to remove this file
                                from appointment?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    onRemoveAppointmentFile(file._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {file.mimeType?.startsWith("image/") ? (
                          <div className="relative w-20 h-20">
                            <Image
                              src={`/assets/${file.filename}`}
                              fill
                              alt={file.description || file.filename}
                              className="cursor-pointer object-cover"
                              onClick={() => onFileClick(file._id)}
                            />
                          </div>
                        ) : (
                          <a
                            className="flex flex-col gap-2 text-sm justify-center"
                            href={`/assets/${file.filename}`}
                            target="_blank"
                          >
                            <div className="max-w-10 flex self-center">
                              <FileIcon
                                extension={file.filename.substring(
                                  file.filename.lastIndexOf(".") + 1
                                )}
                                {...defaultStyles[
                                  mimeTypeToExtension(
                                    file.mimeType
                                  ) as DefaultExtensionType
                                ]}
                              />
                            </div>
                            <span className="text-muted-foreground">
                              {file.filename}
                            </span>
                          </a>
                        )}
                      </div>
                    ))}
                    <Dialog
                      open={galleryOpen}
                      onOpenChange={onGalleryOpenChange}
                      modal
                    >
                      <DialogContent className="sm:max-w-[80%] flex flex-col max-h-[100%]">
                        <DialogHeader>
                          <DialogTitle>
                            <span>
                              {appointment.fields.name} for{" "}
                              {appointment.option.name} files
                            </span>
                          </DialogTitle>
                        </DialogHeader>
                        <Carousel className="w-full" setApi={setApi}>
                          <CarouselContent>
                            {galleryItems.map((file, index) => (
                              <CarouselItem key={index}>
                                <div className="flex flex-col gap-2 justify-center h-full">
                                  <div className="w-full flex justify-center">
                                    <Image
                                      src={`/assets/${file.filename}`}
                                      width={800}
                                      height={800}
                                      alt={file.description || file.filename}
                                    />
                                  </div>
                                  <div className="text-muted-foreground text-center">
                                    {file.description || " "}
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-0" />
                          <CarouselNext className="right-0" />
                        </Carousel>
                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </dd>
            </div>

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
