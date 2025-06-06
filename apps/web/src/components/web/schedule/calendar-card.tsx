"use client";
import type { Availability, DateTime, Time } from "@vivid/types";

import React from "react";

import { getTimeZones } from "@vvo/tzdb";

import { Button, Calendar } from "@vivid/ui";

import { withI18n } from "@/i18n/with-i18n";
import { Combobox, IComboboxItem, formatJsx } from "@vivid/ui";
import { Globe2Icon } from "lucide-react";
import { HourNumbers, DateTime as Luxon, MinuteNumbers } from "luxon";
import { BaseCard, BaseCardProps, BaseCardState } from "./base-card";

import { fallbackLanguage } from "@/i18n/i18n";
import { areTimesEqual, formatTimeLocale } from "@vivid/utils";
import * as Locales from "date-fns/locale";

const asJsDate = (dateTime: Luxon) =>
  new Date(dateTime.year, dateTime.month - 1, dateTime.day);

const timeZones: IComboboxItem[] = getTimeZones().map((zone) => ({
  label: `GMT${zone.currentTimeFormat}`,
  shortLabel: `${zone.alternativeName}`,
  value: zone.name,
}));

const formatDate = (date: Date): string =>
  `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

export type CalendarCardProps = BaseCardProps & {
  availability: Availability;
  dateTime?: DateTime;
  timeZone: string;
  onDateTimeSelected: (dateTime: DateTime | undefined) => void;
};

const CalendarCardFC: React.FC<CalendarCardProps> = (
  props: CalendarCardProps
) => {
  const [date, setDate] = React.useState<Date | undefined>(
    props.dateTime?.date
  );
  const [time, setTime] = React.useState<Time | undefined>(
    props.dateTime?.time
  );
  const [timeZone, setTimeZone] = React.useState<string>(
    props.dateTime?.timeZone || props.timeZone
  );

  const changeDate = (date: Date | undefined) => {
    setDate(date);
    setTime(undefined);
  };

  const adjustedAvailability = React.useMemo(
    () =>
      props.availability.map((time) =>
        Luxon.fromMillis(time, { zone: "utc" }).setZone(timeZone)
      ),
    [props.availability, timeZone]
  );

  const dates = React.useMemo(
    () =>
      adjustedAvailability
        .map((dateTime) => asJsDate(dateTime))
        .sort((a, b) => a.getTime() - b.getTime()),
    [adjustedAvailability]
  );

  const isDisabledDay = React.useCallback(
    (day: Date) =>
      dates.map((date) => formatDate(date)).indexOf(formatDate(day)) < 0,
    [dates]
  );

  const times = React.useMemo(
    () =>
      Object.entries(
        adjustedAvailability.reduce(
          (prev, dateTime) => {
            const key = formatDate(asJsDate(dateTime));
            prev[key] = prev[key] || [];
            prev[key].push({
              hour: dateTime.hour as HourNumbers,
              minute: dateTime.minute as MinuteNumbers,
            });
            return prev;
          },
          {} as { [x: string]: Time[] }
        )
      ).reduce(
        (prev, curr) => {
          prev[curr[0]] = curr[1].sort(
            (a, b) => a.hour - b.hour || a.minute - b.minute
          );
          return prev;
        },
        {} as { [x: string]: Time[] }
      ),
    [adjustedAvailability]
  );

  const onDateTimeSelected = props.onDateTimeSelected;

  React.useEffect(() => {
    onDateTimeSelected(
      !date || !time
        ? undefined
        : {
            date,
            time,
            timeZone,
          }
    );
  }, [date, time, timeZone, onDateTimeSelected]);

  const minDate = React.useMemo(() => dates[0], [dates]);
  const maxDate = React.useMemo(() => dates[dates.length - 1], [dates]);

  const propsDateTime = props.dateTime;

  React.useEffect(() => {
    if ((!propsDateTime?.date && !date) || (date && isDisabledDay(date)))
      setDate(minDate);
  }, [minDate, propsDateTime, date, isDisabledDay]);

  const isTimeSelected = React.useCallback(
    (t: Time) => areTimesEqual(t, time),
    [time]
  );

  const timeZoneCombobox = (
    <Combobox
      values={timeZones}
      className="mx-2"
      searchLabel={props.i18n("search_timezone_label")}
      customSearch={(search) =>
        timeZones.filter(
          (zone) =>
            (zone.label as string)
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase()) >= 0
        )
      }
      value={timeZone}
      onItemSelect={(value) => setTimeZone(value)}
    />
  );

  const timeZoneLabel = formatJsx(
    props.i18n("select_timezone_label_format"),
    timeZoneCombobox
  );

  let locale = fallbackLanguage;
  if (locale === "en") locale = "enUS";

  // @ts-ignore not correct english locale
  const calendarLocale = Locales[fallbackLanguage];

  return (
    <div className="relative text-center">
      <div className="mb-3">
        <h2>{props.i18n("select_date_time_label")}</h2>
      </div>
      <div className="mb-3 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-10 not-prose">
          <div className="flex flex-col">
            <div className="mb-3">
              <Calendar
                locale={calendarLocale}
                mode="single"
                selected={date}
                startMonth={Luxon.fromJSDate(minDate)
                  .startOf("month")
                  .toJSDate()}
                endMonth={Luxon.fromJSDate(maxDate).endOf("month").toJSDate()}
                onSelect={changeDate}
                className="rounded-md border"
                disabled={(day: Date) => isDisabledDay(day)}
              />
            </div>
          </div>
          <div className="md:col-span-1">
            {!date ? (
              <h4>{props.i18n("select_date_first_label")}</h4>
            ) : (
              <div className="flex flex-row gap-2 justify-around flex-wrap">
                {(times[formatDate(date)] || []).map((t) => (
                  <div className="" key={formatTimeLocale(t)}>
                    <Button
                      className="w-24"
                      variant={isTimeSelected(t) ? "default" : "outline"}
                      onClick={() => setTime(isTimeSelected(t) ? undefined : t)}
                    >
                      {formatTimeLocale(t)}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground leading-10">
          <Globe2Icon className="inline-block mr-1" />
          {timeZoneLabel}
        </div>
      </div>
    </div>
  );
};

type CalendarCardState = BaseCardState & {
  dateTime?: DateTime;
};

class _CalendarCard extends BaseCard<CalendarCardProps, CalendarCardState> {
  public constructor(props: CalendarCardProps) {
    super(props);
    this.state = {
      dateTime: props.dateTime,
    };
  }

  public get isPrevDisabled(): boolean {
    return false;
  }

  public get isNextDisabled(): boolean {
    return !this.state.dateTime;
  }

  private onDateTimeChange = (dateTime?: DateTime) => {
    this.setState(
      {
        ...this.state,
        dateTime,
      },
      () => this.props.onDateTimeSelected(dateTime)
    );
  };

  public get cardContent(): React.ReactNode {
    return (
      <CalendarCardFC
        {...this.props}
        onDateTimeSelected={this.onDateTimeChange}
      />
    );
  }
}

export const CalendarCard = withI18n(_CalendarCard);
