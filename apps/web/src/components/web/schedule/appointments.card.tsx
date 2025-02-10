import { IWithI18nProps, withI18n } from "@/i18n/withI18n";
import { AppointmentChoice } from "@vivid/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import { MdxContent } from "../mdx/mdxContentClient";

export type AppointmentsCardProps = {
  options: AppointmentChoice[];
  className?: string;
  onSelect: (slug: string) => void;
};

const _AppointmentsCard: React.FC<AppointmentsCardProps & IWithI18nProps> = ({
  options: meetings,
  className,
  onSelect,
  i18n,
}) => {
  const onKeyPress = (id: string, event: React.KeyboardEvent<any>) => {
    if (event.key === "Enter" || event.key === " ") {
      onSelect(id);
      event.preventDefault();
    }
  };

  return (
    <div className={className}>
      {meetings.map((option) => {
        return (
          <Card
            key={option.id}
            onClick={() => onSelect(option.id)}
            onKeyDown={(e) => onKeyPress(option.id, e)}
            className="cursor-pointer flex flex-col justify-between"
            tabIndex={1}
            aria-describedby={`option-${option.id}`}
            role="button"
          >
            <CardHeader id={`option-${option.id}`}>
              <CardTitle>{option.name}</CardTitle>
              <CardDescription className="flex flex-col gap-2">
                <div
                  className="flex flex-row items-center"
                  aria-label={
                    option.duration
                      ? i18n(
                          "form_duration_hour_minutes_label_format",
                          durationToTime(option.duration)
                        )
                      : i18n("custom_duration_label_format")
                  }
                >
                  <Timer className="mr-1" />
                  {option.duration
                    ? i18n(
                        "duration_hour_min_format",
                        durationToTime(option.duration)
                      )
                    : i18n("duration_custom")}
                </div>
                {!!option.price && (
                  <div
                    className="flex flex-row items-center"
                    aria-label={i18n("form_price_label_format", {
                      price: option.price.toFixed(2).replace(/\.00$/, ""),
                    })}
                  >
                    <DollarSign className="mr-1" aria-label="" />
                    {option.price.toFixed(2).replace(/\.00$/, "")}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MdxContent source={option.description} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const AppointmentsCard = withI18n(_AppointmentsCard);
