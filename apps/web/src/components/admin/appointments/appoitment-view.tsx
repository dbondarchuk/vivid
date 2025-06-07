"use client";

import Image from "next/image";
import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";

import { AppointmentActionButton } from "@/components/admin/appointments/action-button";
import {
  removeAppointmentFile,
  updateAppointmentNote,
} from "@/components/admin/appointments/actions";
import { AppointmentCalendar } from "@/components/admin/appointments/appointment-calendar";
import { Markdown } from "@/components/web/markdown";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Appointment,
  AppointmentStatus,
  AssetEntity,
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
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DndFileInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  Link,
  Spinner,
  Textarea,
  toastPromise,
  useUploadFile,
} from "@vivid/ui";
import { durationToTime, mimeTypeToExtension } from "@vivid/utils";
import { getTimeZones } from "@vvo/tzdb";
import {
  CalendarCheck2,
  CalendarSearch,
  CalendarSync,
  CalendarX2,
  Send,
  Trash,
} from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppointmentRescheduleDialog } from "./appointment-reschedule-dialog";
import { SendCommunicationDialog } from "../communications/send-message-dialog";
import { RecentCommunications } from "../communications/communications";

const timeZones = getTimeZones();

const noteFormSchema = z.object({
  note: z.string().optional(),
});

type NoteFormSchema = z.infer<typeof noteFormSchema>;

export const AppointmentView: React.FC<{
  appointment: Appointment;
  timeZone?: string;
}> = ({ appointment: propAppointment, timeZone }) => {
  const router = useRouter();

  const [communicationsKey, setCommunicationsKey] = React.useState<string>();

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
      await toastPromise(updateAppointmentNote(appointment._id, data.note), {
        success: "Appointment note was updated.",
        error: "There was a problem with your request.",
      });

      router.refresh();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRemoveAppointmentFile = async (fileId: string) => {
    try {
      setLoading(true);
      await toastPromise(removeAppointmentFile(fileId), {
        success: "Your changes were saved.",
        error: "There was a problem with your request.",
      });

      const fileIndex =
        appointment.files?.findIndex((file) => file._id === fileId) ?? -1;
      if (fileIndex >= 0) {
        appointment.files?.splice(fileIndex, 1);
      }

      router.refresh();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const { name, email, phone, ...restFields } = appointment.fields;

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

  const onAssetAdded = (asset: AssetEntity) => {
    if (!appointment.files) {
      appointment.files = [];
    }

    appointment.files.push(asset);
    router.refresh();
  };

  const [fileToUpload, setFileToUpload] = React.useState<File | undefined>();
  const { isUploading, progress, uploadFile, uploadingFile } = useUploadFile({
    appointmentId: appointment._id,
    onUploadComplete: (file) => {
      onAssetAdded(file);
    },
  });

  const onClickUpload = async () => {
    if (!fileToUpload) return;

    await uploadFile(fileToUpload);

    setFileToUpload(undefined);
  };

  return (
    <div className="flex flex-col gap-4 w-full @container [contain:layout]">
      <div className="flex flex-row justify-end gap-2 flex-wrap [&>form]:hidden">
        <SendCommunicationDialog
          appointmentId={appointment._id}
          onSuccess={() =>
            setCommunicationsKey(new Date().getTime().toString())
          }
        >
          <Button variant="outline">
            <Send /> Send message
          </Button>
        </SendCommunicationDialog>
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
              timeZone={timeZone}
              onRescheduled={reschedule}
              trigger={
                <Button
                  variant="secondary"
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
                  {/* <AlertDialogAction asChild> */}
                  <AppointmentActionButton
                    variant="destructive"
                    _id={appointment._id}
                    status="declined"
                    onSuccess={updateStatus}
                  >
                    <CalendarX2 size={20} />
                    Decline
                  </AppointmentActionButton>
                  {/* </AlertDialogAction> */}
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
      <div className="flex flex-col @4xl:grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <dl className="divide-y">
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Date &amp; Time:</dt>
              <dd className="col-span-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="dateTime" className="border-none">
                    <AccordionTrigger>
                      {DateTime.fromJSDate(appointment.dateTime)
                        .setZone(timeZone)
                        .toLocaleString(
                          DateTime.DATETIME_MED_WITH_WEEKDAY
                        )}{" "}
                      -{" "}
                      {DateTime.fromJSDate(appointment.dateTime)
                        .setZone(timeZone)
                        .plus({ minutes: appointment.totalDuration })
                        .toLocaleString(DateTime.TIME_SIMPLE)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-1">
                        <div>Date and time:</div>
                        <div>
                          {DateTime.fromJSDate(appointment.dateTime)
                            .setZone(timeZone)
                            .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
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
                            timeZones.find(
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
                            .setZone(timeZone)
                            .plus({ minutes: appointment.totalDuration })
                            .toLocaleString(
                              DateTime.DATETIME_MED_WITH_WEEKDAY
                            )}{" "}
                        </div>
                        <div>Requested at:</div>
                        <div>
                          {DateTime.fromJSDate(appointment.createdAt)
                            .setZone(timeZone)
                            .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
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

            {appointment.totalPrice && (
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt>Price:</dt>
                <dd className="col-span-2">${appointment.totalPrice}</dd>
              </div>
            )}
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Customer</dt>
              <dd className="col-span-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="option" className="border-none">
                    <AccordionTrigger className="text-left">
                      <span>
                        {appointment.customer.name}{" "}
                        <span className="text-sm text-muted-foreground">
                          ({appointment.customer.email})
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-3 gap-1">
                        <div>Name:</div>
                        <div className="col-span-2">
                          <Link
                            variant="default"
                            href={`/admin/dashboard/customers/${appointment.customerId}`}
                          >
                            {appointment.customer.name}
                          </Link>
                        </div>
                        <div>Email:</div>
                        <div className="col-span-2">
                          {appointment.customer.email}
                        </div>
                        <div>Phone:</div>
                        <div className="col-span-2">
                          {appointment.customer.phone}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </dd>
            </div>
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">Fields</dt>
              <dd className="col-span-2">
                {/* <Accordion type="single" collapsible>
                  <AccordionItem value="option" className="border-none">
                    <AccordionTrigger className="text-left">
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
                        <div>Phone:</div>
                        <div className="col-span-2">
                          <Link
                            variant="default"
                            href={`/admin/dashboard/appointments?search=${encodeURIComponent(
                              phone
                            )}`}
                          >
                            {phone}
                          </Link>
                        </div>
                        {Object.entries(restFields).map(([key, value]) => (
                          <React.Fragment key={key}>
                            <div>
                              {appointment.fieldsLabels?.[key] ? (
                                <>
                                  <span>{appointment.fieldsLabels?.[key]}</span>{" "}
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
                              {typeof value === "boolean" ? (
                                value ? (
                                  "Yes"
                                ) : (
                                  "No"
                                )
                              ) : (
                                <Link
                                  variant="default"
                                  href={`/admin/dashboard/appointments?search=${encodeURIComponent(
                                    value.toString()
                                  )}`}
                                >
                                  {value.toString()}
                                </Link>
                              )}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="grid grid-cols-3 gap-1 text-sm">
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
                  <div>Phone:</div>
                  <div className="col-span-2">
                    <Link
                      variant="default"
                      href={`/admin/dashboard/appointments?search=${encodeURIComponent(
                        phone
                      )}`}
                    >
                      {phone}
                    </Link>
                  </div>
                  {Object.entries(restFields).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <div>
                        {appointment.fieldsLabels?.[key] ? (
                          <>
                            <span>{appointment.fieldsLabels?.[key]}</span>{" "}
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
                        {typeof value === "boolean" ? (
                          value ? (
                            "Yes"
                          ) : (
                            "No"
                          )
                        ) : (
                          <Link
                            variant="default"
                            href={`/admin/dashboard/appointments?search=${encodeURIComponent(
                              value.toString()
                            )}`}
                          >
                            {value.toString()}
                          </Link>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
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
                        <div>Option:</div>
                        <div className="col-span-2">
                          <Link
                            href={`/admin/dashboard/services/options/${appointment.option._id}`}
                            variant="default"
                          >
                            {appointment.option.name}
                          </Link>
                        </div>
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
                              <Link
                                href={`/admin/dashboard/services/addons/${addon._id}`}
                                variant="default"
                              >
                                {addon.name}
                              </Link>
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
              <dd className="col-span-2 flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="w-full flex flex-col gap-2">
                    <DndFileInput
                      name="files"
                      disabled={loading}
                      value={fileToUpload}
                      onChange={setFileToUpload}
                    />
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={onClickUpload}
                      disabled={loading || isUploading || !fileToUpload}
                    >
                      Upload
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {uploadingFile && (
                      <div className="w-full relative flex justify-center">
                        {uploadingFile.type.startsWith("image/") ? (
                          <div className="relative w-20 h-20">
                            <img
                              src={URL.createObjectURL(uploadingFile)}
                              alt={uploadingFile.name}
                              className="w-full object-contain h-full"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 text-sm justify-center">
                            <div className="max-w-10 flex self-center">
                              <FileIcon
                                extension={uploadingFile.name.substring(
                                  uploadingFile.name.lastIndexOf(".") + 1
                                )}
                                {...defaultStyles[
                                  mimeTypeToExtension(
                                    uploadingFile.type
                                  ) as DefaultExtensionType
                                ]}
                              />
                            </div>
                            <div className="text-muted-foreground text-center">
                              {uploadingFile.name}
                            </div>
                          </div>
                        )}
                        <div className="absolute top-0 bottom-0 right-0 left-0 bg-background/50 flex items-center flex-col gap-2 justify-center">
                          <Spinner className="w-5 h-5" />
                          <span className="text-sm">{progress}%</span>
                        </div>
                      </div>
                    )}
                    {appointment.files?.map((file) => (
                      <div
                        className="w-full relative flex justify-center"
                        key={file._id}
                      >
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              disabled={loading}
                              variant="ghost"
                              className="absolute -right-1 -top-1 text-destructive hover:bg-destructive hover:text-destructive-foreground z-[3]"
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
                                extension={file.filename?.substring(
                                  file.filename.lastIndexOf(".") + 1
                                )}
                                {...defaultStyles[
                                  mimeTypeToExtension(
                                    file.mimeType
                                  ) as DefaultExtensionType
                                ]}
                              />
                            </div>
                            <div className="text-muted-foreground text-center">
                              {file.filename.substring(
                                file.filename.lastIndexOf("/") + 1
                              )}
                            </div>
                          </a>
                        )}
                      </div>
                    ))}
                    <Dialog
                      open={galleryOpen}
                      onOpenChange={onGalleryOpenChange}
                      modal
                    >
                      <DialogContent
                        className="sm:max-w-[80%] flex flex-col max-h-lvh bg-transparent p-0 shadow-none border-0"
                        overlayVariant="blur"
                        closeClassName="bg-background"
                      >
                        <Carousel className="w-full" setApi={setApi}>
                          <CarouselContent>
                            {galleryItems.map((file, index) => (
                              <CarouselItem key={index}>
                                <div className="flex flex-col gap-2 justify-center h-full max-h-lvh">
                                  <div className="w-full flex justify-center max-h-[80%]">
                                    <Image
                                      src={`/assets/${file.filename}`}
                                      width={800}
                                      height={800}
                                      className="object-contain"
                                      alt={file.description || file.filename}
                                    />
                                  </div>
                                  <div className="text-background text-center">
                                    {file.description || " "}
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-0" />
                          <CarouselNext className="right-0" />
                        </Carousel>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </dd>
            </div>
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
          <AppointmentCalendar appointment={appointment} timeZone={timeZone} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="font-semibold flex flex-row gap-1 items-center">
          Appointment communications
        </div>
        <RecentCommunications
          appointmentId={appointment._id}
          key={communicationsKey}
        />
      </div>
    </div>
  );
};
