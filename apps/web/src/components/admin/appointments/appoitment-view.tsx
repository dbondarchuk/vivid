"use client";

import { useI18n, useLocale } from "@vivid/i18n";
import Image from "next/image";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";

import { AppointmentActionButton } from "@/components/admin/appointments/action-button";
import {
  removeAppointmentFile,
  updateAppointmentNote,
} from "@/components/admin/appointments/actions";
import { AppointmentCalendar } from "@/components/admin/appointments/appointment-calendar";
import { PaymentCard } from "@/components/payments/payment-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Appointment, AppointmentStatus, AssetEntity } from "@vivid/types";
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
  Link,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toastPromise,
  useTimeZone,
  useUploadFile,
} from "@vivid/ui";
import {
  durationToTime,
  formatAmountString,
  mimeTypeToExtension,
} from "@vivid/utils";
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
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RecentCommunications } from "../communications/communications";
import { SendCommunicationDialog } from "../communications/send-message-dialog";
import { AppointmentDeclineDialog } from "./appointment-decline-dialog";
import { AppointmentHistory } from "./appointment-history";
import { AppointmentRescheduleDialog } from "./appointment-reschedule-dialog";

const timeZones = getTimeZones();

const noteFormSchema = z.object({
  note: z.string().optional(),
});

type NoteFormSchema = z.infer<typeof noteFormSchema>;

const views = [
  "details",
  "payments",
  "files",
  "communications",
  "history",
] as const;
type View = (typeof views)[number];

export const AppointmentView: React.FC<{
  appointment: Appointment;
  view?: View;
}> = ({ appointment: propAppointment, view }) => {
  const t = useI18n("admin");
  const locale = useLocale();
  const router = useRouter();

  const timeZone = useTimeZone();

  const [key, setKey] = React.useState<string>();
  const params = useSearchParams();
  const defaultView = view ?? params.get("view") ?? "details";

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
        success: t("appointments.view.noteUpdated"),
        error: t("appointments.view.requestError"),
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
        success: t("appointments.view.changesSaved"),
        error: t("appointments.view.requestError"),
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

    setKey(new Date().getTime().toString());
  };

  const updateStatus = (newStatus: AppointmentStatus) => {
    setAppointment((prev) => ({
      ...prev,
      status: newStatus,
    }));

    setKey(new Date().getTime().toString());
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

  const [filesToUpload, setFilesToUpload] = React.useState<File[]>([]);
  const { isUploading, progress, uploadFile, uploadingFiles } = useUploadFile({
    appointmentId: appointment._id,
    onFileUploaded: (file) => {
      onAssetAdded(file);
    },
  });

  const onClickUpload = async () => {
    if (!filesToUpload?.length) return;

    await uploadFile(filesToUpload.map((file) => ({ file })));

    setFilesToUpload([]);
  };

  const paidPayments = appointment.payments?.filter(
    (payment) => payment.status === "paid"
  );

  const totalPaid =
    paidPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return (
    <div className="flex flex-col gap-4 w-full @container [contain:layout]">
      <div className="flex flex-row justify-end gap-2 flex-wrap [&>form]:hidden">
        <SendCommunicationDialog
          appointmentId={appointment._id}
          onSuccess={() => setKey(new Date().getTime().toString())}
        >
          <Button variant="outline">
            <Send /> {t("appointments.view.sendMessage")}
          </Button>
        </SendCommunicationDialog>
        <Link
          className="inline-flex flex-row gap-2 items-center"
          variant="primary"
          button
          href={`/admin/dashboard/appointments/new?from=${appointment._id}`}
        >
          <CalendarSync size={20} /> {t("appointments.view.scheduleAgain")}
        </Link>

        {appointment.status !== "declined" ? (
          <>
            <AppointmentRescheduleDialog
              appointment={appointment}
              onRescheduled={reschedule}
              trigger={
                <Button
                  variant="secondary"
                  className="inline-flex flex-row gap-2 items-center"
                >
                  <CalendarSearch size={20} />
                  {t("appointments.view.reschedule")}
                </Button>
              }
            />
            <AppointmentDeclineDialog
              appointment={appointment}
              onSuccess={updateStatus}
              trigger={
                <Button
                  variant="destructive"
                  className="inline-flex flex-row gap-2 items-center"
                >
                  <CalendarX2 size={20} /> {t("appointments.view.decline")}
                </Button>
              }
            />
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
            <CalendarCheck2 size={20} /> {t("appointments.view.confirm")}
          </AppointmentActionButton>
        ) : null}
      </div>
      {/* <div className="flex flex-row justify-end gap-2 flex-wrap [&>form]:hidden">
        <SendCommunicationDialog
          appointmentId={appointment._id}
          onSuccess={() =>
            setCommunicationsKey(new Date().getTime().toString())
          }
        >
          <Button variant="outline">
            <Send /> {t("appointments.view.sendMessage")}
          </Button>
        </SendCommunicationDialog>
        <Link
          className="inline-flex flex-row gap-2 items-center"
          variant="primary"
          button
          href={`/admin/dashboard/appointments/new?from=${appointment._id}`}
        >
          <CalendarSync size={20} /> {t("appointments.view.scheduleAgain")}
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
                  {t("appointments.view.reschedule")}
                </Button>
              }
            />
            <AppointmentDeclineDialog
              appointment={appointment}
              trigger={
                <Button
                  variant="destructive"
                  className="inline-flex flex-row gap-2 items-center"
                >
                  <CalendarX2 size={20} /> {t("appointments.view.decline")}
                </Button>
              }
            />
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
            <CalendarCheck2 size={20} /> {t("appointments.view.confirm")}
          </AppointmentActionButton>
        ) : null}
      </div>
      <div className="flex flex-col @4xl:grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <dl className="divide-y">
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">
                {t("appointments.view.dateTime")}:
              </dt>
              <dd className="col-span-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="dateTime" className="border-none">
                    <AccordionTrigger>
                      {DateTime.fromJSDate(appointment.dateTime)
                        .setZone(timeZone)
                        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY, {
                          locale,
                        })}{" "}
                      -{" "}
                      {DateTime.fromJSDate(appointment.dateTime)
                        .setZone(timeZone)
                        .plus({ minutes: appointment.totalDuration })
                        .toLocaleString(DateTime.TIME_SIMPLE, { locale })}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-1">
                        <div>{t("appointments.view.dateAndTime")}:</div>
                        <div>
                          {DateTime.fromJSDate(appointment.dateTime)
                            .setZone(timeZone)
                            .toLocaleString(
                              DateTime.DATETIME_MED_WITH_WEEKDAY,
                              {
                                locale,
                              }
                            )}
                        </div>
                        <div>{t("appointments.view.duration")}:</div>
                        <div>
                          {duration.hours > 0 && (
                            <>
                              {duration.hours} {t("appointments.view.hours")}
                            </>
                          )}
                          {duration.hours > 0 && duration.minutes > 0 && <> </>}
                          {duration.minutes > 0 && (
                            <>
                              {duration.minutes}{" "}
                              {t("appointments.view.minutes")}
                            </>
                          )}
                        </div>
                        <div>{t("appointments.view.timezone")}:</div>
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
                        <div>{t("appointments.view.endsAt")}:</div>
                        <div>
                          {DateTime.fromJSDate(appointment.dateTime)
                            .setZone(timeZone)
                            .plus({ minutes: appointment.totalDuration })
                            .toLocaleString(
                              DateTime.DATETIME_MED_WITH_WEEKDAY,
                              { locale }
                            )}{" "}
                        </div>
                        <div>{t("appointments.view.requestedAt")}:</div>
                        <div>
                          {DateTime.fromJSDate(appointment.createdAt)
                            .setZone(timeZone)
                            .toLocaleString(
                              DateTime.DATETIME_MED_WITH_WEEKDAY,
                              {
                                locale,
                              }
                            )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </dd>
            </div>
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">
                {t("appointments.view.status")}
              </dt>
              <dd className="col-span-2">
                {t(`appointments.status.${appointment.status}`)}
              </dd>
            </div>

            {!!appointment.totalPrice && (
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt>{t("appointments.view.price")}:</dt>
                <dd className="col-span-2">
                  ${formatAmountString(appointment.totalPrice)}
                </dd>
              </div>
            )}
            {!!totalPaid && (
              <>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt>{t("appointments.view.amountPaid")}:</dt>
                  <dd className="col-span-2">
                    ${formatAmountString(totalPaid)}
                  </dd>
                </div>
                {!!appointment.totalPrice &&
                  appointment.totalPrice - totalPaid > 0 && (
                    <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt>{t("appointments.view.amountLeftToPay")}:</dt>
                      <dd className="col-span-2">
                        $
                        {formatAmountString(appointment.totalPrice - totalPaid)}
                      </dd>
                    </div>
                  )}
              </>
            )}
            <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex self-center">
                {t("appointments.view.customer")}
              </dt>
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
                        <div>{t("appointments.view.name")}:</div>
                        <div className="col-span-2">
                          <Link
                            variant="default"
                            href={`/admin/dashboard/customers/${appointment.customerId}`}
                          >
                            {appointment.customer.name}
                          </Link>
                        </div>
                        <div>{t("appointments.view.email")}:</div>
                        <div className="col-span-2">
                          {appointment.customer.email}
                        </div>
                        <div>{t("appointments.view.phone")}:</div>
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
              <dt className="flex self-center">
                {t("appointments.view.fields")}
              </dt>
              <dd className="col-span-2">
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <div>{t("appointments.view.name")}:</div>
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
                  <div>{t("appointments.view.email")}:</div>
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
                  <div>{t("appointments.view.phone")}:</div>
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
                            t("appointments.view.yes")
                          ) : (
                            t("appointments.view.no")
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
              <dt className="flex self-center">
                {t("appointments.view.selectedOption")}
              </dt>
              <dd className="col-span-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="option" className="border-none">
                    <AccordionTrigger>
                      {appointment.option.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-3 gap-1">
                        <div>{t("appointments.view.option")}:</div>
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
                            <div>{t("appointments.view.duration")}:</div>
                            <div className="col-span-2">
                              {appointment.option.duration}{" "}
                              {t("appointments.view.minutes")}
                            </div>
                          </>
                        )}
                        {!!appointment.option.price && (
                          <>
                            <div>{t("appointments.view.price")}:</div>
                            <div className="col-span-2">
                              ${formatAmountString(appointment.option.price)}
                            </div>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </dd>
            </div>
            {appointment.addons && appointment.addons.length > 0 && (
              <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="flex self-center">
                  {t("appointments.view.selectedAddons")}:
                </dt>
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
                                    <li>
                                      {t("appointments.view.duration")}:{" "}
                                      {addon.duration}{" "}
                                      {t("appointments.view.min")}
                                    </li>
                                  )}
                                  {!!addon.price && (
                                    <li>
                                      {t("appointments.view.price")}: $
                                      {formatAmountString(addon.price)}
                                    </li>
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
          </dl>
        </div>
        <div className="flex flex-col gap-2">
          <AppointmentCalendar appointment={appointment} timeZone={timeZone} />
        </div>
      </div>

      <Form {...noteForm}>
        <form
          onSubmit={noteForm.handleSubmit(onNoteSubmit)}
          onBlur={noteForm.handleSubmit(onNoteSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="font-semibold flex flex-row gap-1 items-center">
            {t("appointments.view.note")}
          </div>
          <FormField
            control={noteForm.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder={t("appointments.view.note")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form> */}

      {/* <div className="flex flex-col gap-2 @container/files">
        <div className="font-semibold flex flex-row gap-1 items-center">
          {t("appointments.view.files")}
        </div>
        <div className="flex flex-col gap-2">
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
              {t("appointments.view.upload")}
            </Button>
          </div>
          <div className="grid grid-cols-1 @md/files:grid-cols-2 @lg/files:grid-cols-3 @xl/files:grid-cols-4 gap-2">
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
                      title={t("appointments.view.removeAppointmentFile")}
                    >
                      <Trash size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("appointments.view.confirmTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("appointments.view.confirmRemoveFile")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("appointments.view.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction variant="destructive" asChild>
                        <Button
                          onClick={() => onRemoveAppointmentFile(file._id)}
                        >
                          {t("appointments.view.delete")}
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
            <Dialog open={galleryOpen} onOpenChange={onGalleryOpenChange} modal>
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
      </div> */}

      <Tabs defaultValue={defaultView} className="flex flex-col gap-2 mb-4">
        {/* <TabsList className="w-fit self-end"> */}
        <TabsList className="w-full [&>button]:flex-1 bg-card border flex-wrap h-auto">
          <TabsTrigger value="details">
            {t("appointments.view.details")}
          </TabsTrigger>
          <TabsTrigger value="payments">
            {t("appointments.view.payments")}
          </TabsTrigger>
          <TabsTrigger value="files">
            {t("appointments.view.files")}
          </TabsTrigger>
          <TabsTrigger value="communications">
            {t("appointments.view.communications")}
          </TabsTrigger>
          <TabsTrigger value="history">
            {t("appointments.view.history")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="flex flex-col @4xl:grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <dl className="divide-y">
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex self-center">
                    {t("appointments.view.dateTime")}:
                  </dt>
                  <dd className="col-span-2">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="dateTime" className="border-none">
                        <AccordionTrigger>
                          {DateTime.fromJSDate(appointment.dateTime)
                            .setZone(timeZone)
                            .toLocaleString(
                              DateTime.DATETIME_MED_WITH_WEEKDAY,
                              {
                                locale,
                              }
                            )}{" "}
                          -{" "}
                          {DateTime.fromJSDate(appointment.dateTime)
                            .setZone(timeZone)
                            .plus({ minutes: appointment.totalDuration })
                            .toLocaleString(DateTime.TIME_SIMPLE, { locale })}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-1">
                            <div>{t("appointments.view.dateAndTime")}:</div>
                            <div>
                              {DateTime.fromJSDate(appointment.dateTime)
                                .setZone(timeZone)
                                .toLocaleString(
                                  DateTime.DATETIME_MED_WITH_WEEKDAY,
                                  {
                                    locale,
                                  }
                                )}
                            </div>
                            <div>{t("appointments.view.duration")}:</div>
                            <div>
                              {duration.hours > 0 && (
                                <>
                                  {duration.hours}{" "}
                                  {t("appointments.view.hours")}
                                </>
                              )}
                              {duration.hours > 0 && duration.minutes > 0 && (
                                <> </>
                              )}
                              {duration.minutes > 0 && (
                                <>
                                  {duration.minutes}{" "}
                                  {t("appointments.view.minutes")}
                                </>
                              )}
                            </div>
                            <div>{t("appointments.view.timezone")}:</div>
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
                            <div>{t("appointments.view.endsAt")}:</div>
                            <div>
                              {DateTime.fromJSDate(appointment.dateTime)
                                .setZone(timeZone)
                                .plus({ minutes: appointment.totalDuration })
                                .toLocaleString(
                                  DateTime.DATETIME_MED_WITH_WEEKDAY,
                                  { locale }
                                )}{" "}
                            </div>
                            <div>{t("appointments.view.requestedAt")}:</div>
                            <div>
                              {DateTime.fromJSDate(appointment.createdAt)
                                .setZone(timeZone)
                                .toLocaleString(
                                  DateTime.DATETIME_MED_WITH_WEEKDAY,
                                  {
                                    locale,
                                  }
                                )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </dd>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex self-center">
                    {t("appointments.view.status")}
                  </dt>
                  <dd className="col-span-2">
                    {t(`appointments.status.${appointment.status}`)}
                  </dd>
                </div>

                {!!appointment.totalPrice && (
                  <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt>{t("appointments.view.price")}:</dt>
                    <dd className="col-span-2">
                      ${formatAmountString(appointment.totalPrice)}
                    </dd>
                  </div>
                )}
                {!!totalPaid && (
                  <>
                    <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt>{t("appointments.view.amountPaid")}:</dt>
                      <dd className="col-span-2">
                        ${formatAmountString(totalPaid)}
                      </dd>
                    </div>
                    {!!appointment.totalPrice &&
                      appointment.totalPrice - totalPaid > 0 && (
                        <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt>{t("appointments.view.amountLeftToPay")}:</dt>
                          <dd className="col-span-2">
                            $
                            {formatAmountString(
                              appointment.totalPrice - totalPaid
                            )}
                          </dd>
                        </div>
                      )}
                  </>
                )}
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="flex self-center">
                    {t("appointments.view.customer")}
                  </dt>
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
                            <div>{t("appointments.view.name")}:</div>
                            <div className="col-span-2">
                              <Link
                                variant="default"
                                href={`/admin/dashboard/customers/${appointment.customerId}`}
                              >
                                {appointment.customer.name}
                              </Link>
                            </div>
                            <div>{t("appointments.view.email")}:</div>
                            <div className="col-span-2">
                              {appointment.customer.email}
                            </div>
                            <div>{t("appointments.view.phone")}:</div>
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
                  <dt className="flex self-center">
                    {t("appointments.view.fields")}
                  </dt>
                  <dd className="col-span-2">
                    <div className="grid grid-cols-3 gap-1 text-sm">
                      <div>{t("appointments.view.name")}:</div>
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
                      <div>{t("appointments.view.email")}:</div>
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
                      <div>{t("appointments.view.phone")}:</div>
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
                                t("appointments.view.yes")
                              ) : (
                                t("appointments.view.no")
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
                  <dt className="flex self-center">
                    {t("appointments.view.selectedOption")}
                  </dt>
                  <dd className="col-span-2">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="option" className="border-none">
                        <AccordionTrigger>
                          {appointment.option.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-3 gap-1">
                            <div>{t("appointments.view.option")}:</div>
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
                                <div>{t("appointments.view.duration")}:</div>
                                <div className="col-span-2">
                                  {appointment.option.duration}{" "}
                                  {t("appointments.view.minutes")}
                                </div>
                              </>
                            )}
                            {!!appointment.option.price && (
                              <>
                                <div>{t("appointments.view.price")}:</div>
                                <div className="col-span-2">
                                  $
                                  {formatAmountString(appointment.option.price)}
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </dd>
                </div>
                {appointment.addons && appointment.addons.length > 0 && (
                  <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="flex self-center">
                      {t("appointments.view.selectedAddons")}:
                    </dt>
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
                                        <li>
                                          {t("appointments.view.duration")}:{" "}
                                          {addon.duration}{" "}
                                          {t("appointments.view.min")}
                                        </li>
                                      )}
                                      {!!addon.price && (
                                        <li>
                                          {t("appointments.view.price")}: $
                                          {formatAmountString(addon.price)}
                                        </li>
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
              </dl>
            </div>
            <div className="flex flex-col gap-2">
              <AppointmentCalendar appointment={appointment} />
            </div>
          </div>

          <Form {...noteForm}>
            <form
              onSubmit={noteForm.handleSubmit(onNoteSubmit)}
              onBlur={noteForm.handleSubmit(onNoteSubmit)}
              className="flex flex-col gap-2"
            >
              <div className="font-semibold flex flex-row gap-1 items-center">
                {t("appointments.view.note")}
              </div>
              <FormField
                control={noteForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder={t("appointments.view.note")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="payments">
          {!!appointment.payments?.length ? (
            <div className="grid grid-cols-1 @md/payments:grid-cols-2 @lg/payments:grid-cols-3 gap-2 py-2">
              {appointment.payments.map((payment) => (
                <PaymentCard payment={payment} key={payment._id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 bg-card p-4 rounded border">
              <div className="font-semibold flex flex-row gap-1 items-center">
                {t("appointments.view.noPayments")}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="files">
          <div className="flex flex-col gap-2 @container/files">
            <div className="w-full flex flex-col gap-2">
              <DndFileInput
                name="files"
                disabled={loading}
                maxFiles={10}
                value={filesToUpload}
                onChange={setFilesToUpload}
              />
              <Button
                variant="default"
                className="w-full"
                onClick={onClickUpload}
                disabled={loading || isUploading || !filesToUpload?.length}
              >
                {t("appointments.view.upload")}
              </Button>
            </div>
            <div className="grid grid-cols-1 @md/files:grid-cols-2 @lg/files:grid-cols-3 @xl/files:grid-cols-4 gap-2">
              {uploadingFiles.length > 0 && (
                <div className="w-full relative flex justify-center">
                  {uploadingFiles.map((file) => (
                    <>
                      {file.type.startsWith("image/") ? (
                        <div className="relative w-20 h-20" key={file.name}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full object-contain h-full"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex flex-col gap-2 text-sm justify-center"
                          key={file.name}
                        >
                          <div className="max-w-10 flex self-center">
                            <FileIcon
                              extension={file.name.substring(
                                file.name.lastIndexOf(".") + 1
                              )}
                              {...defaultStyles[
                                mimeTypeToExtension(
                                  file.type
                                ) as DefaultExtensionType
                              ]}
                            />
                          </div>
                          <div className="text-muted-foreground text-center">
                            {file.name}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
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
                        title={t("appointments.view.removeAppointmentFile")}
                      >
                        <Trash size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("appointments.view.confirmTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("appointments.view.confirmRemoveFile")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("appointments.view.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction variant="destructive" asChild>
                          <Button
                            onClick={() => onRemoveAppointmentFile(file._id)}
                          >
                            {t("appointments.view.delete")}
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
        </TabsContent>
        <TabsContent value="communications">
          <RecentCommunications appointmentId={appointment._id} key={key} />
        </TabsContent>
        <TabsContent value="history">
          <AppointmentHistory appointmentId={appointment._id} key={key} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
