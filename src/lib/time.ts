import { Time } from "@/types";
import { HourNumbers, MinuteNumbers } from "luxon";

export const formatTime = (time: Time) =>
  `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;

export const parseTime = (time: string): Time => {
  const parts = time?.split(":");
  if (parts?.length !== 2) throw new Error(`Wrong time format: ${time}`);

  return {
    hour: parseInt(parts[0], 10) as HourNumbers,
    minute: parseInt(parts[1], 10) as MinuteNumbers,
  };
};

export const areTimesEqual = (
  timeA: Time | undefined | null,
  timeB: Time | undefined | null
) => timeA?.hour === timeB?.hour && timeA?.minute === timeB?.minute;
