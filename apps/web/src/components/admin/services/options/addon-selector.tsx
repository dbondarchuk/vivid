import { AppointmentAddon } from "@vivid/types";
import {
  cn,
  Combobox,
  IComboboxItem,
  MultiSelect,
  OptionType,
  toast,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { Clock, DollarSign } from "lucide-react";
import React from "react";

const AddonLabel: React.FC<{ addon: AppointmentAddon }> = ({ addon }) => {
  const time = addon.duration ? durationToTime(addon.duration) : null;
  return (
    <span className="flex flex-col justify-center gap-2 shrink overflow-hidden text-nowrap min-w-0">
      {addon.name}{" "}
      {time && (
        <div className="inline-flex gap-2 items-center text-xs italic">
          <Clock size={16} /> {`${time.hours}hr ${time.minutes}min`}
        </div>
      )}
      {addon.price && (
        <div className="inline-flex gap-2 items-center text-xs italic">
          <DollarSign size={16} /> ${addon.price}
        </div>
      )}
    </span>
  );
};

const getAddons = async () => {
  const url = `/admin/api/services/addons`;
  const response = await fetch(url, {
    method: "GET",
    cache: "default",
  });

  if (response.status >= 400) {
    toast.error("Request failed.");
    const text = await response.text();
    console.error(
      `Request to fetch addons failed: ${response.status}; ${text}`
    );

    return [];
  }

  return (await response.json()) as AppointmentAddon[];
};

const checkAddonSearch = (addon: AppointmentAddon, query: string) => {
  const search = query.toLocaleLowerCase();
  return addon.name.toLocaleLowerCase().includes(search);
};

export type AddonSelectorProps = {
  disabled?: boolean;
  excludeIds?: string[];
  className?: string;
} & (
  | {
      onItemSelect?: (value: string) => void;
      value?: string;
      multi?: false;
    }
  | {
      multi: true;
      onItemSelect?: (value: string[]) => void;
      value?: string[];
    }
);

export const AddonSelector: React.FC<AddonSelectorProps> = ({
  disabled,
  className,
  excludeIds,
  value,
  onItemSelect,
  multi,
}) => {
  const [addons, setAddons] = React.useState<AppointmentAddon[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fn = async () => {
      try {
        setIsLoading(true);
        const fields = await getAddons();
        setAddons(fields);
      } finally {
        setIsLoading(false);
      }
    };

    fn();
  }, []);

  const addonValues = (addons: AppointmentAddon[]): IComboboxItem[] =>
    addons
      .filter(({ _id }) => !excludeIds?.find((id) => id === _id))
      .map((field) => {
        return {
          value: field._id,
          shortLabel: (
            <span className="shrink overflow-hidden text-nowrap min-w-0">
              {field.name}
            </span>
          ),
          label: <AddonLabel addon={field} />,
        };
      });

  const addonMultiOptions = (addons: AppointmentAddon[]): OptionType[] =>
    addons
      .filter(({ _id }) => !excludeIds?.find((id) => id === _id))
      .map((addon) => {
        return {
          value: addon._id,
          label: addon.name,
        };
      });

  return multi ? (
    <MultiSelect
      disabled={disabled || isLoading}
      className={cn("flex font-normal text-base", className)}
      options={addonMultiOptions(addons)}
      placeholder={isLoading ? "Loading addons..." : "Select addon"}
      selected={value || []}
      onChange={(value) => onItemSelect?.(value as string[])}
    />
  ) : (
    <Combobox
      disabled={disabled || isLoading}
      className={cn("flex font-normal text-base", className)}
      values={addonValues(addons)}
      searchLabel={isLoading ? "Loading addons..." : "Select addon"}
      value={value}
      customSearch={(search) =>
        addonValues(addons.filter((app) => checkAddonSearch(app, search)))
      }
      onItemSelect={onItemSelect}
    />
  );
};
