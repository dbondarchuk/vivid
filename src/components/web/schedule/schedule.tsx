"use client";

import { useI18n } from "@/i18n/i18n";
import { Availability } from "@/types/booking/availability";
import type {
  DateTime,
  AppointmentEvent,
  AppointmentFields,
  AppointmentAddon,
  AppointmentChoice,
} from "@/types";
import { DateTime as LuxonDateTime } from "luxon";
import React from "react";
import { CalendarCard } from "./calendar.card";
import { ConfirmationCard } from "./confirmation.card";
import { DurationCard } from "./duration.card";
import { FormCard } from "./form.card";
import { useToast } from "../../ui/use-toast";
import { AddonsCard } from "./addons.card";

export type ScheduleProps = {
  appointmentOption: AppointmentChoice;
  back?: () => void;
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
    }),
    [i18n]
  );

  const { toast } = useToast();

  const [duration, setDuration] = React.useState<number | undefined>(
    props.appointmentOption.duration
  );

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

  const [availability, setAvailability] = React.useState<Availability>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fields, setFields] = React.useState<Record<string, any>>({});

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
        setIsLoading(false);
      })
      .catch(() => {
        setAvailability([]);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: errors.fetchTitle,
          description: errors.fetchDescription,
        });
      });
  };

  React.useEffect(() => {
    if (initialStep === "calendar") {
      fetchAvailability();
    }
  }, [initialStep, i18n]);

  const submitForm = (fields: AppointmentFields) => {
    if (!dateTime) return;

    setIsLoading(true);
    fetch("/api/event", {
      method: "POST",
      body: JSON.stringify({
        dateTime: LuxonDateTime.fromObject(
          {
            year: dateTime.date.getFullYear(),
            month: dateTime.date.getMonth() + 1,
            day: dateTime.date.getDate(),
            hour: dateTime.time.hour,
            minute: dateTime.time.minute,
            second: 0,
          },
          { zone: dateTime?.timeZone }
        )
          .toUTC()
          .toISO(),
        totalPrice: getTotalPrice() || undefined,
        timeZone: dateTime!.timeZone,
        totalDuration: getTotalDuration(),
        fields,
        option: {
          ...props.appointmentOption,
          fields: undefined,
          addons: undefined,
        },
        addons: selectedAddons,
      } as AppointmentEvent),
    })
      .then((response) => {
        if (response.status >= 400) throw new Error(response.statusText);
        return response.json();
      })
      .then(() => {
        setFields(fields);
        setIsLoading(false);
        setStep("confirmation");
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: errors.submitTitle,
          description: errors.submitDescription,
        });
      });
  };

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
      {step === "duration" && (
        <DurationCard
          prev={props.back ? prevStep : undefined}
          appointmentOption={props.appointmentOption}
          selectedAddons={selectedAddons}
          onDurationChange={(duration) => setDuration(duration)}
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
          availability={availability}
          selectedAddons={selectedAddons}
          dateTime={dateTime}
          onDateTimeSelected={(dateTime) => setDateTime(dateTime)}
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
        />
      )}
      {step === "confirmation" && (
        <ConfirmationCard
          fields={fields}
          duration={duration!}
          selectedAddons={selectedAddons}
          appointmentOption={props.appointmentOption}
        />
      )}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-14 h-14 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-slate-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only"></span>
          </div>
        </div>
      )}
    </div>
  );
};
