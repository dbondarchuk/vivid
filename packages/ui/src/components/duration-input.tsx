import { durationToTime, timeToDuration } from "@vivid/utils";
import { Input, InputProps } from "./input";
import { cn } from "../utils";
import {
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
} from "./input-group";
import React from "react";
import { Clock } from "lucide-react";

export type DurationInputProps = Omit<
  InputProps,
  "type" | "value" | "onChange" | "placeholder" | "min" | "max"
> & {
  value?: number;
  onChange?: (value?: number) => void;
  inputClassName?: string;
  placeholderHours?: string;
  placeholderMinutes?: string;
};

export const DurationInput: React.FC<DurationInputProps> = ({
  value,
  onChange,
  className,
  inputClassName,
  placeholderHours,
  placeholderMinutes,
  name,
  itemRef: _,
  ...rest
}) => {
  const duration = value ? durationToTime(value) : undefined;
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const onHoursChange = (v?: string) => {
    const value = typeof v !== "undefined" ? parseInt(v) : undefined;
    onChange?.(
      timeToDuration(
        !duration?.minutes && !value
          ? undefined
          : {
              hours: value || 0,
              minutes: duration?.minutes || 0,
            }
      )
    );
  };

  const onMinutesChange = (v?: string) => {
    const value = typeof v !== "undefined" ? parseInt(v) : undefined;
    onChange?.(
      timeToDuration(
        !duration?.hours && !value
          ? undefined
          : {
              minutes: value || 0,
              hours: duration?.hours || 0,
            }
      )
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
    setFunction: (value: string) => void
  ) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10);
    setFunction(((numValue + 1) % max).toString().padStart(2, "0"));
  };

  const decrementValue = (
    value: string,
    max: number,
    setFunction: (value: string) => void
  ) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10);
    setFunction(((numValue - 1 + max) % max).toString().padStart(2, "0"));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "hours" | "minutes"
  ) => {
    switch (e.key) {
      case "ArrowRight":
        if (
          field === "hours" &&
          minutesRef.current &&
          (e.currentTarget.selectionStart ?? 0) > 0
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
          className="w-12 border-0 bg-transparent p-2 text-center focus:outline-none focus:ring-0 "
          aria-label="Hours"
          name={name ? `${name}.hours` : undefined}
          onKeyDown={(e) => handleKeyDown(e, "hours")}
          {...rest}
          ref={hoursRef}
        />
        <span className="pr-3 text-sm text-muted-foreground">hr</span>
        <span className="text-lg font-medium px-0.5">:</span>
        <Input
          type="text"
          inputMode="numeric"
          placeholder={placeholderMinutes || "00"}
          value={duration?.minutes}
          onChange={handleMinutesChange}
          onKeyDown={(e) => handleKeyDown(e, "minutes")}
          min={0}
          max={59}
          variant="ghost"
          className="w-12 border-0 bg-transparent p-2 text-center focus:outline-none focus:ring-0 "
          aria-label="Minutes"
          name={name ? `${name}.minutes` : undefined}
          {...rest}
          ref={minutesRef}
        />
        <span className="pr-3 text-sm text-muted-foreground">min</span>
      </div>
    </div>
    // <div className={cn("flex flex-col md:flex-row gap-4 w-full", className)}>
    //   <InputGroup className="flex-1">
    //     <InputGroupInput>
    //       <Input
    //         value={duration?.hours}
    //         type="number"
    //         onChange={(e) => onHoursChange(e.target.value)}
    //         className={cn(InputGroupInputClasses(), inputClassName)}
    //         placeholder={placeholderHours}
    //         min={0}
    //         {...rest}
    //       />
    //     </InputGroupInput>
    //     <InputSuffix className={InputGroupSuffixClasses()}>hr</InputSuffix>
    //   </InputGroup>
    //   <InputGroup className="flex-1">
    //     <InputGroupInput>
    //       <Input
    //         value={duration?.minutes}
    //         type="number"
    //         onChange={(e) => onMinutesChange(e.target.value)}
    //         className={cn(InputGroupInputClasses(), inputClassName)}
    //         placeholder={placeholderMinutes}
    //         min={0}
    //         max={59}
    //         {...rest}
    //       />
    //     </InputGroupInput>
    //     <InputSuffix className={InputGroupSuffixClasses()}>min</InputSuffix>
    //   </InputGroup>
    // </div>
  );
};
