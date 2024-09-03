import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

export type IconSelectProps = {
  field: ControllerRenderProps;
  disabled?: boolean;
};

const iconValues = Object.keys(icons).map(
  (icon) =>
    ({
      value: icon,
      label: (
        <div className="flex flex-row gap-1 items-center">
          <Icon name={icon as keyof typeof icons} size={20} /> {icon}
        </div>
      ),
    } as IComboboxItem)
);

export const IconSelect: React.FC<IconSelectProps> = ({ field, disabled }) => {
  return (
    <Combobox
      className="flex w-full font-normal text-base"
      values={iconValues}
      searchLabel="Select icon"
      disabled={disabled}
      customSearch={(search) =>
        iconValues.filter(
          (icon) =>
            icon.value
              .toLocaleLowerCase()
              .indexOf(search.toLocaleLowerCase()) >= 0
        )
      }
      value={field.value}
      onItemSelect={(value) => field.onChange(value)}
    />
  );
};
