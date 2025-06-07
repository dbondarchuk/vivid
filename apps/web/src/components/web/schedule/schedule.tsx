"use client";

import { useI18n } from "@/i18n/i18n";
import type {
  AppointmentAddon,
  AppointmentChoice,
  AppointmentEvent,
  AppointmentFields,
  AppointmentRequest,
  DateTime,
  FieldSchema,
  WithDatabaseId,
} from "@vivid/types";
import { Availability } from "@vivid/types";
import { Spinner, toast } from "@vivid/ui";
import { DateTime as LuxonDateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";
import { AddonsCard } from "./addons-card";
import { CalendarCard } from "./calendar-card";
import { ConfirmationCard } from "./confirmation-card";
import { DurationCard } from "./duration-card";
import { FormCard } from "./form-card";

export type ScheduleProps = {
  appointmentOption: AppointmentChoice;
  back?: () => void;
  successPage?: string;
  fieldsSchema: Record<string, FieldSchema>;
  timeZone: string;
};

type Step = "duration" | "addons" | "calendar" | "form" | "confirmation";

export const Schedule: React.FC<ScheduleProps> = (props: ScheduleProps) => {
  const i18n = useI18n();

  const errors = React.useMemo(
    () => ({
      fetchTitle: i18n("availability_fetch_failed_title"),
      fetchDescription: i18n("availability_fetch_failed_description"),
      submitTitle: i18n("submit_event_failed_title"),
      submitDescription: i18n("submit_event_failed_description"),
      timeNotAvailableDescription: i18n(
        "submit_event_failed_time_not_available_description"
      ),
    }),
    [i18n]
  );

  const topRef = React.createRef<HTMLDivElement>();

  const appointmentOptionDuration = props.appointmentOption.duration;
  const [duration, setDuration] = React.useState<number | undefined>(
    appointmentOptionDuration
  );

  React.useEffect(() => {
    setDuration(appointmentOptionDuration);
  }, [appointmentOptionDuration, setDuration]);

  let initialStep: Step = "duration";
  if (props.appointmentOption.addons && props.appointmentOption.addons.length) {
    initialStep = "addons";
  } else if (props.appointmentOption.duration) initialStep = "calendar";

  const [step, setStep] = React.useState<Step>(initialStep);
  const [dateTime, setDateTime] = React.useState<DateTime | undefined>(
    undefined
  );

  const [selectedAddons, setSelectedAddons] = React.useState<
    AppointmentAddon[]
  >([]);

  const addonsFields =
    selectedAddons?.flatMap((addon) => addon.fields || []) || [];
  const allFormFields = [
    ...(props.appointmentOption.fields || []),
    ...addonsFields,
  ];
  const fieldsIdsRequired = [...allFormFields].reduce(
    (map, field) => ({
      ...map,
      [field.id]: !!map[field.id] || !!field.required,
    }),
    {} as Record<string, boolean>
  );

  const formFields = Object.entries(fieldsIdsRequired)
    .filter(([id]) => !!props.fieldsSchema[id])
    .map(([id, required]) => ({
      ...props.fieldsSchema[id],
      required: !!props.fieldsSchema[id].required || required,
    }));

  const [availability, setAvailability] = React.useState<Availability>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fields, setFields] = React.useState<Record<string, any>>({});

  const router = useRouter();

  const getTotalDuration = () => {
    if (!duration) return undefined;

    return (
      duration +
      (selectedAddons || []).reduce(
        (sum, addon) => sum + (addon.duration || 0),
        0
      )
    );
  };

  const getTotalPrice = () => {
    return (
      (props.appointmentOption.price || 0) +
      (selectedAddons || []).reduce((sum, addon) => sum + (addon.price || 0), 0)
    );
  };

  const fetchAvailability = () => {
    const totalDuration = getTotalDuration();
    if (!totalDuration) return;
    if (errors.fetchTitle === "availability_fetch_failed_title") return;

    setIsLoading(true);
    fetch(`/api/availability?duration=${getTotalDuration()}`)
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then((data: Availability) => {
        setAvailability(data);
      })
      .catch(() => {
        setAvailability([]);
        toast.error(errors.fetchTitle, {
          description: errors.fetchDescription,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    if (initialStep === "calendar") {
      fetchAvailability();
    }
  }, [initialStep, i18n]);

  const submitForm = async (fields: AppointmentFields) => {
    if (!dateTime) return;

    setIsLoading(true);
    setFields(fields);

    try {
      const eventBody: AppointmentRequest = {
        dateTime: LuxonDateTime.fromObject(
          {
            year: dateTime.date.getFullYear(),
            month: dateTime.date.getMonth() + 1,
            day: dateTime.date.getDate(),
            hour: dateTime.time.hour,
            minute: dateTime.time.minute,
            second: 0,
          },
          { zone: dateTime.timeZone }
        )
          .toUTC()
          .toJSDate(),
        timeZone: dateTime.timeZone,
        duration: duration,
        optionId: props.appointmentOption._id,
        addonsIds: selectedAddons?.map((addon) => addon._id),
        fields: Object.entries(fields)
          .filter(([_, value]) => !((value as any) instanceof File))
          .reduce(
            (obj, cur) => ({
              ...obj,
              [cur[0]]: cur[1],
            }),
            {} as AppointmentFields
          ),
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(eventBody));

      const files = Object.entries(fields).filter(
        ([_, value]) => (value as any) instanceof File
      );

      for (const [fileField, file] of files) {
        formData.append("fileField", fileField);
        formData.append(`file_${fileField}`, file as any as File);
      }

      const response = await fetch("/api/event", {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        const error = await response.json();
        if (error.error === "time_not_available") {
          toast.error(errors.submitTitle, {
            description: errors.timeNotAvailableDescription,
          });
        } else {
          toast.error(errors.submitTitle, {
            description: errors.submitDescription,
          });
        }

        fetchAvailability();
        setDateTime(undefined);
        setStep("calendar");
        return;
      } else if (response.status > 400) {
        throw new Error(response.statusText);
      }

      const { id } = (await response.json()) as WithDatabaseId<any>;

      if (props.successPage) {
        const expireDate = LuxonDateTime.now().plus({ minutes: 1 });

        document.cookie = `appointment_id=${encodeURIComponent(
          id
        )}; expires=${expireDate.toJSDate().toUTCString()};`;

        router.push(props.successPage);
      } else {
        setStep("confirmation");
      }
    } catch (e) {
      toast.error(errors.submitTitle, {
        description: errors.submitDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    topRef?.current?.scrollIntoView();
  }, [step]);

  const nextStep = () => {
    let next: Step | undefined = undefined;

    switch (step) {
      case "duration":
        if (
          props.appointmentOption.addons &&
          props.appointmentOption.addons.length
        ) {
          next = "addons";
        } else {
          next = "calendar";
          fetchAvailability();
        }

        break;
      case "addons":
        next = "calendar";
        fetchAvailability();
        break;
      case "calendar":
        next = "form";
        break;
      case "form":
        next = "confirmation";
        break;
    }

    if (next) setStep(next);
  };

  const prevStep = () => {
    let prev: Step | undefined = undefined;

    switch (step) {
      case "duration":
        if (props.back) {
          props.back();
          return;
        }

        break;

      case "addons":
        if (props.appointmentOption.duration && props.back) {
          props.back();
          return;
        }

        prev = "duration";
        break;

      case "calendar":
        if (
          props.appointmentOption.addons &&
          props.appointmentOption.addons.length
        ) {
          prev = "addons";
          break;
        }

        if (props.appointmentOption.duration && props.back) {
          props.back();
          return;
        }

        prev = "duration";
        break;
      case "form":
        prev = "calendar";
        break;
    }

    if (prev) setStep(prev);
  };

  return (
    <div className="relative">
      <div ref={topRef} />
      {step === "duration" && (
        <DurationCard
          prev={props.back ? prevStep : undefined}
          appointmentOption={props.appointmentOption}
          selectedAddons={selectedAddons}
          onDurationChange={(duration) => setDuration(duration)}
          optionDuration={duration}
          duration={duration}
          next={nextStep}
        />
      )}
      {step === "addons" && props.appointmentOption.addons && (
        <AddonsCard
          prev={
            props.appointmentOption.duration || props.back
              ? prevStep
              : undefined
          }
          next={nextStep}
          appointmentOption={props.appointmentOption}
          optionDuration={duration}
          onAddonSelectionChange={setSelectedAddons}
          selectedAddons={selectedAddons}
        />
      )}
      {step === "calendar" && (
        <CalendarCard
          prev={
            props.appointmentOption.duration ||
            props.back ||
            (props.appointmentOption.addons &&
              props.appointmentOption.addons.length)
              ? prevStep
              : undefined
          }
          next={nextStep}
          appointmentOption={props.appointmentOption}
          optionDuration={duration}
          availability={availability}
          selectedAddons={selectedAddons}
          dateTime={dateTime}
          onDateTimeSelected={(dateTime) => setDateTime(dateTime)}
          timeZone={props.timeZone}
        />
      )}
      {step === "form" && dateTime && (
        <FormCard
          prev={prevStep}
          onSubmit={submitForm}
          dateTime={dateTime}
          selectedAddons={selectedAddons}
          duration={duration!}
          appointmentOption={props.appointmentOption}
          optionDuration={duration}
          values={fields}
          fields={formFields}
          onFormChange={setFields}
        />
      )}
      {step === "confirmation" && (
        <ConfirmationCard
          fields={fields}
          duration={duration!}
          selectedAddons={selectedAddons}
          appointmentOption={props.appointmentOption}
          optionDuration={duration}
        />
      )}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
          <div role="status">
            <Spinner className="w-20 h-20" />
            <span className="sr-only">Please wait...</span>
          </div>
        </div>
      )}
    </div>
  );
};
