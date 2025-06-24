import {
  fallbackLanguage,
  I18nKeys,
  TranslationKeys,
  useI18n,
} from "@vivid/i18n";
import { Time } from "@vivid/types";
import { timeZones } from "@vivid/types/src/utils/zTimeZone";
import {
  durationToTime,
  formatAmountString,
  formatTimeLocale,
} from "@vivid/utils";
import { TimeZone } from "@vvo/tzdb";
import { Calendar, Clock, DollarSign, Globe2, Timer } from "lucide-react";
import { HourNumbers, DateTime as Luxon, MinuteNumbers } from "luxon";
import React from "react";
import { useScheduleContext } from "./context";

export const CardWithAppointmentInformation: React.FC<
  React.PropsWithChildren & { title: TranslationKeys }
> = ({ children, title }) => {
  const i18n = useI18n();
  const { dateTime, duration, price } = useScheduleContext();

  if (!dateTime) return children;

  const date = Luxon.fromJSDate(dateTime.date);
  const timeEndLuxon = date
    .set({
      hour: dateTime.time.hour,
      minute: dateTime.time.minute,
    })
    .plus({ minutes: duration });

  const timeEnd: Time = {
    hour: timeEndLuxon.hour as HourNumbers,
    minute: timeEndLuxon.minute as MinuteNumbers,
  };

  let timeZone: TimeZone | undefined = timeZones.find((tz) => {
    return (
      dateTime.timeZone === tz.name || tz.group.includes(dateTime.timeZone)
    );
  });
  if (!timeZone) {
    const defaultZone = Luxon.now().zoneName;
    timeZone = timeZones.find((tz) => {
      return defaultZone === tz.name || tz.group.includes(defaultZone || "");
    });
  }

  return (
    <div className="py-4 not-prose">
      <div className="mb-3 grid md:grid-cols-3 gap-2 ">
        <div className="grid md:col-span-1 md:pr-5 md:flex gap-3 md:flex-col">
          <div className="flex items-center">
            <Calendar className="mr-1" />
            {i18n("form_date_label_format", {
              date: date.toLocaleString(Luxon.DATE_FULL, {
                locale: fallbackLanguage,
              }),
            })}
          </div>
          <div className="flex items-center">
            <Clock className="mr-1" />
            {i18n("form_time_label_format", {
              start: formatTimeLocale(dateTime.time),
              end: formatTimeLocale(timeEnd),
            })}
          </div>
          {!!duration && (
            <div className="flex items-center">
              <Timer className="mr-1" />
              {i18n(
                "form_duration_hour_minutes_label_format",
                durationToTime(duration)
              )}
            </div>
          )}
          {!!price && (
            <div className="flex items-center">
              <DollarSign className="mr-1" />
              {i18n("form_price_label_format", {
                price: formatAmountString(price),
              })}
            </div>
          )}
          <div className="flex items-center">
            <Globe2 className="mr-1 flex-none" />
            {i18n("timezone_format", {
              timezone: timeZone?.currentTimeFormat,
            })}
          </div>
        </div>
        <div className="md:col-span-2 md:pr-2 sm:mb-3">
          <div className="mb-3">
            <h2 className="mt-0">{i18n(title)}</h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
