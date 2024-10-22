"use client";

import { useI18n } from "@/i18n/i18n";
import { Availability } from "@/types/booking/availability";
import type {
  DateTime,
  AppointmentEvent,
  AppointmentFields,
  AppointmentAddon,
  AppointmentChoice,
  WithId,
} from "@/types";
import { DateTime as LuxonDateTime } from "luxon";
import React from "react";
import { CalendarCard } from "./calendar.card";
import { ConfirmationCard } from "./confirmation.card";
import { DurationCard } from "./duration.card";
import { FormCard } from "./form.card";
import { useToast } from "../../ui/use-toast";
import { AddonsCard } from "./addons.card";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export type ScheduleProps = {
  appointmentOption: AppointmentChoice;
  back?: () => void;
  successPage?: string;
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
  const topRef = React.createRef<HTMLDivElement>();

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
        toast({
          variant: "destructive",
          title: errors.fetchTitle,
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
      .then(({ id }: WithId<any>) => {
        setFields(fields);
        setIsLoading(false);

        if (props.successPage) {
          const expireDate = LuxonDateTime.now().plus({ minutes: 1 });

          document.cookie = `appointment_id=${encodeURIComponent(
            id
          )}; expires=${expireDate.toJSDate().toUTCString()};`;

          router.push(props.successPage);
        } else {
          setStep("confirmation");
        }
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
            <Spinner className="w-20 h-20" />
            <span className="sr-only">Please wait...</span>
          </div>
        </div>
      )}
    </div>
  );
};
