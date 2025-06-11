import { withI18n } from "@/i18n/with-i18n";
import { Button } from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { ReactNode } from "react";
import { BaseCard, BaseCardProps } from "./base-card";

export type DurationCardProps = BaseCardProps & {
  duration?: number;
  onDurationChange: (duration: number | undefined) => void;
};

const durations = [15, 30, 45, 60, 90, 120];

class _DurationCard extends BaseCard<DurationCardProps> {
  public get isPrevDisabled(): boolean {
    return true;
  }

  public get isNextDisabled(): boolean {
    return !this.props.duration;
  }

  public get cardContent(): ReactNode {
    return (
      <div className="relative text-center">
        <div className="mb-3">
          <h2>{this.props.i18n("duration_select_title")}</h2>
        </div>
        <div className="flex flex-row gap-2 justify-around flex-wrap">
          {durations.map((dur) => (
            <div className="" key={dur}>
              <Button
                className="w-36"
                variant={this.props.duration === dur ? "default" : "outline"}
                onClick={() =>
                  this.props.onDurationChange(
                    this.props.duration === dur ? undefined : dur
                  )
                }
              >
                {this.props.i18n(
                  "duration_hour_minutes_format",
                  durationToTime(dur)
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export const DurationCardFC: React.FC<DurationCardProps> = (
  props: DurationCardProps
) => {
  return (
    <div className="relative text-center">
      <div className="mb-3">
        <h2>How much time do you need?</h2>
      </div>
      <div className="flex flex-row gap-2 justify-around flex-wrap">
        {durations.map((dur) => (
          <div className="" key={dur}>
            <Button
              className="w-36"
              variant={props.duration === dur ? "default" : "outline"}
              onClick={() => {
                props.onDurationChange(
                  props.duration === dur ? undefined : dur
                );
                props.setPromoCode(undefined);
              }}
            >
              {dur} minutes
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DurationCard = withI18n(_DurationCard);
