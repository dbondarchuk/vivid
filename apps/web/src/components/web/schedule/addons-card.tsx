import { withI18n } from "@/i18n/with-i18n";
import { AppointmentAddon } from "@vivid/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { DollarSign, Timer } from "lucide-react";
import { ReactNode } from "react";
import { MdxContent } from "../mdx/mdx-content-client";
import { BaseCard, BaseCardProps } from "./base-card";
import { PlateStaticEditor } from "@vivid/rte";

export type AddonsCardProps = BaseCardProps & {
  onAddonSelectionChange: (addons: AppointmentAddon[]) => void;
};

class _AddonsCard extends BaseCard<AddonsCardProps> {
  public get isPrevDisabled(): boolean {
    return false;
  }

  public get isNextDisabled(): boolean {
    return false;
  }

  private onClick(option: AppointmentAddon): void {
    const index = (this.props.selectedAddons || []).findIndex(
      (addon) => addon._id === option._id
    );

    if (index < 0) {
      this.props.onAddonSelectionChange([
        ...(this.props.selectedAddons || []),
        option,
      ]);
    } else {
      this.props.onAddonSelectionChange([
        ...(this.props.selectedAddons || []).slice(0, index),
        ...(this.props.selectedAddons || []).slice(index + 1),
      ]);
    }
  }

  public get cardContent(): ReactNode {
    return (
      <div className="flex flex-col">
        <div className="text-center">
          <h2>{this.props.i18n("select_addons_label")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(this.props.appointmentOption.addons || []).map((addon) => {
            return (
              <Card
                key={addon._id}
                onClick={() => this.onClick(addon)}
                className="cursor-pointer flex flex-col justify-between"
              >
                <CardHeader
                  className="flex flex-row w-full"
                  id={`addon-${addon._id}`}
                >
                  <div className="flex flex-col grow">
                    <CardTitle className="mt-0">{addon.name}</CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      {addon.duration && (
                        <div
                          className="flex flex-row items-center"
                          aria-label={this.props.i18n(
                            "form_duration_hour_minutes_label_format",
                            durationToTime(addon.duration)
                          )}
                        >
                          <Timer className="mr-1" />
                          {this.props.i18n(
                            "duration_hour_min_format",
                            durationToTime(addon.duration)
                          )}
                        </div>
                      )}
                      {addon.price && (
                        <div
                          className="flex flex-row items-center"
                          aria-label={this.props.i18n(
                            "form_price_label_format",
                            {
                              price: addon.price
                                .toFixed(2)
                                .replace(/\.00$/, ""),
                            }
                          )}
                        >
                          <DollarSign className="mr-1" />
                          {addon.price.toFixed(2).replace(/\.00$/, "")}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex place-content-start">
                    <Checkbox
                      aria-describedby={`addon-${addon._id}`}
                      checked={this.props.selectedAddons?.some(
                        (a) => a._id === addon._id
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* <PlateStaticEditor value={addon.description} /> */}
                  <MdxContent source={addon.description} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}

export const AddonsCard = withI18n(_AddonsCard);
