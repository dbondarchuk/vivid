import { useI18n } from "@vivid/i18n";
import { durationToTime, timeToDuration } from "@vivid/utils";
import { Clock } from "lucide-react";
import React from "react";
import { cn } from "../utils/cn";
import { Input, InputProps } from "./input";

export type DurationInputProps = Omit<
  InputProps,
  "type" | "value" | "onChange" | "placeholder" | "min" | "max"
> & {
  value?: number | null;
  onChange?: (value: number | null) => void;
  inputClassName?: string;
  placeholderHours?: string;
  placeholderMinutes?: string;
  type?: "hours-minutes" | "minutes-seconds";
};

const sizes: Record<NonNullable<InputProps["h"]>, string> = {
  lg: "text-base py-2",
  md: "text-sm py-2",
  sm: "text-xs py-1.5",
  xs: "text-xs py-1",
};

export const DurationInput: React.FC<DurationInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  placeholderHours,
  placeholderMinutes,
  name,
  type = "hours-minutes",
  itemRef: _,
  ...rest
}) => {
  const t = useI18n("ui");
  const duration = value ? durationToTime(value) : undefined;
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const onHoursChange = (v?: string) => {
    const value = parseInt(v as string) ?? undefined;
    onChange?.(
      timeToDuration(
        !duration?.minutes && !value
          ? null
          : {
              hours: value || 0,
              minutes: duration?.minutes || 0,
            },
      ) ?? null,
    );
  };

  const onMinutesChange = (v?: string) => {
    const value = parseInt(v as string) ?? undefined;
    onChange?.(
      timeToDuration(
        !duration?.hours && !value
          ? null
          : {
              minutes: value || 0,
              hours: duration?.hours || 0,
            },
      ) ?? null,
    );
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");

    if (value.length > 2) return;

    onHoursChange(value);

    // Auto-advance to minutes when 2 digits are entered
    if (value.length === 2 && minutesRef.current) {
      minutesRef.current.focus();
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");

    if (value.length > 2) return;

    // Ensure minutes are between 0-59
    if (
      value === "" ||
      (Number.parseInt(value) >= 0 && Number.parseInt(value) < 60)
    ) {
      onMinutesChange(value);
    }
  };

  const incrementValue = (
    value: string,
    max: number,
    setFunction: (value: string) => void,
  ) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10);
    setFunction(((numValue + 1) % max).toString().padStart(2, "0"));
  };

  const decrementValue = (
    value: string,
    max: number,
    setFunction: (value: string) => void,
  ) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10);
    setFunction(((numValue - 1 + max) % max).toString().padStart(2, "0"));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "hours" | "minutes",
  ) => {
    switch (e.key) {
      case "ArrowRight":
        if (
          field === "hours" &&
          minutesRef.current &&
          (!e.currentTarget.value?.length ||
            (e.currentTarget.selectionStart ?? 0) > 0)
        ) {
          minutesRef.current.focus();
        }
        break;
      case "ArrowLeft":
        if (
          field === "minutes" &&
          hoursRef.current &&
          (e.currentTarget.selectionStart ?? 0) === 0
        ) {
          hoursRef.current.focus();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (field === "hours") {
          incrementValue(e.currentTarget.value, 24, onHoursChange);
        } else {
          incrementValue(e.currentTarget.value, 60, onMinutesChange);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (field === "hours") {
          decrementValue(e.currentTarget.value, 24, onHoursChange);
        } else {
          decrementValue(e.currentTarget.value, 60, onMinutesChange);
        }
        break;
      case "Backspace":
        if (
          field === "minutes" &&
          e.currentTarget.value === "" &&
          hoursRef.current
        ) {
          hoursRef.current.focus();
        }
        break;
    }
  };

  const firstPartName = type === "hours-minutes" ? "hours" : "minutes";
  const secondPartName = type === "hours-minutes" ? "minutes" : "seconds";
  const firstPartLabel =
    type === "hours-minutes" ? t("common.hours") : t("common.minutes");
  const firstPartShortLabel =
    type === "hours-minutes" ? t("durationInput.hr") : t("durationInput.min");
  const secondPartLabel =
    type === "hours-minutes" ? t("common.minutes") : t("common.seconds");
  const secondPartShortLabel =
    type === "hours-minutes" ? t("durationInput.min") : t("durationInput.sec");

  const size = rest.h ? sizes[rest.h] : sizes.md;

  return (
    <div className="flex items-center bg-background border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      <div className="flex items-center pl-3 text-muted-foreground">
        <Clock className="h-4 w-4" />
      </div>
      <div className="flex items-center">
        <Input
          type="text"
          inputMode="numeric"
          placeholder={placeholderHours || "00"}
          min={0}
          value={duration?.hours}
          onChange={handleHoursChange}
          variant="ghost"
          className="w-12 border-0 bg-transparent p-2 text-center focus:outline-none focus:ring-0"
          aria-label={firstPartLabel}
          name={name ? `${name}.${firstPartName}` : firstPartName}
          onKeyDown={(e) => handleKeyDown(e, "hours")}
          {...rest}
          ref={hoursRef}
        />
        <span className={cn("pr-3 text-muted-foreground", size)}>
          {firstPartShortLabel}
        </span>
        <span className={cn("font-medium px-0.5", size)}>:</span>
        <Input
          type="text"
          inputMode="numeric"
          placeholder={placeholderMinutes || "00"}
          value={duration?.minutes?.toString()}
          onChange={handleMinutesChange}
          onKeyDown={(e) => handleKeyDown(e, "minutes")}
          min={0}
          max={59}
          variant="ghost"
          className="w-12 border-0 bg-transparent p-2 text-center focus:outline-none focus:ring-0"
          aria-label={secondPartLabel}
          name={name ? `${name}.${secondPartName}` : secondPartName}
          {...rest}
          ref={minutesRef}
        />
        <span className={cn("pr-3 text-muted-foreground", size)}>
          {secondPartShortLabel}
        </span>
      </div>
    </div>
  );
};
