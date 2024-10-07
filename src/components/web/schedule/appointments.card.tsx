import { IWithI18nProps, withI18n } from "@/i18n/withI18n";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import { AppointmentChoice } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
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
            className="cursor-pointer"
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
                      ? i18n("form_duration_label_format", {
                          duration: option.duration,
                        })
                      : i18n("custom_duration_label_format")
                  }
                >
                  <Timer className="mr-1" />
                  {option.duration
                    ? i18n("duration_min_format", { duration: option.duration })
                    : i18n("duration_custom")}
                </div>
                {option.price && (
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
