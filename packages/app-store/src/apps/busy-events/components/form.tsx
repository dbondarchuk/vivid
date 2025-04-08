"use client";

import { Schedule, ScheduleOverride, WeekIdentifier } from "@vivid/types";
import {
  Button,
  Scheduler,
  Skeleton,
  toast,
  toastPromise,
  useDebounce,
  WeekSelector,
} from "@vivid/ui";
import { getDateFromWeekIdentifier, getWeekIdentifier } from "@vivid/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getWeeklyEvents, setEvents } from "./actions";

type WeeklySchedule = ScheduleOverride["schedule"];
type BusyEventsFormProps = {
  appId: string;
};

export const BusyEventsForm: React.FC<BusyEventsFormProps> = ({ appId }) => {
  const [loading, setLoading] = React.useState(true);

  const weekStr = useSearchParams().get("week");
  const week =
    (weekStr ? parseInt(weekStr) : null) || getWeekIdentifier(new Date());

  const router = useRouter();
  const todayWeek = getWeekIdentifier(new Date());

  const [schedule, setSchedule] = useState<Schedule>();

  const [currentSchedule, setCurrentSchedule] = useState(schedule);
  const delayedSchedule = useDebounce(currentSchedule);

  const weekDate = useMemo(() => getDateFromWeekIdentifier(week), [week]);

  const loadSchedule = async () => {
    setLoading(true);

    try {
      const response = await getWeeklyEvents(appId, week);
      setSchedule(response);
      setCurrentSchedule(response);
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load the schedule");
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [appId, week]);

  const onScheduleChange = async (newSchedule: WeeklySchedule) => {
    if (week < todayWeek) return;
    if (JSON.stringify(schedule) === JSON.stringify(newSchedule)) return;

    try {
      // setLoading(true);
      await toastPromise(setEvents(appId, week, newSchedule), {
        success: "Saved!",
        error: "There was a problem with your request.",
      });

      setSchedule(newSchedule);
    } catch (error: any) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!delayedSchedule) return;
    onScheduleChange(delayedSchedule);
  }, [delayedSchedule]);

  const onWeekChange = React.useCallback(
    (newWeek: WeekIdentifier) => {
      if (newWeek !== week) {
        router.push(`?week=${newWeek}`);
      }
    },
    [router, week]
  );

  return (
    <div className="w-full space-y-8 relative flex flex-col gap-2">
      <div className="flex flex-col lg:flex-row gap-2 justify-between">
        <Button
          variant={week === todayWeek ? "primary" : "outline"}
          disabled={week === todayWeek || loading}
          onClick={() => onWeekChange(todayWeek)}
        >
          This week
        </Button>
        <div className="flex flex-row gap-1 max-lg:w-full">
          <Button
            variant="outline"
            size="icon"
            title="Previous week"
            disabled={loading}
            onClick={() => onWeekChange(week - 1)}
          >
            <ChevronLeft />
          </Button>
          <WeekSelector
            initialWeek={week}
            disabled={loading}
            onWeekChange={onWeekChange}
            className="lg:w-[324px] flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            title="Next week"
            disabled={loading}
            onClick={() => onWeekChange(week + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      {loading ? (
        <Skeleton className="w-full h-[70vh]" />
      ) : (
        <Scheduler
          value={schedule || []}
          onChange={setCurrentSchedule}
          disabled={week < todayWeek}
          weekDate={weekDate}
        />
      )}
    </div>
  );
};
