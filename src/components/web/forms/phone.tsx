import { Combobox } from "@/components/ui/combobox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupInput,
  InputSuffix,
} from "@/components/ui/inputGroup";
import { Mask, MaskedInput } from "@/components/ui/maskedInput";
import React from "react";

import countries from "countries-phone-masks";
import { FieldValues, Path } from "react-hook-form";
import { getFieldName, IFormFieldProps } from "./formFieldProps";

import { useI18n } from "@/i18n/i18n";
import "./css/flags.css";
import { FormFieldLabel } from "./formFieldLabel";
import { WithLabelFieldData } from "@/types";
import { FormFieldDescription } from "./formFieldDescription";
import {
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "@/components/admin/forms/inputGroupClasses";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";

export const PhoneField: <T extends FieldValues>(
  p: IFormFieldProps<T, WithLabelFieldData>
) => React.ReactElement<IFormFieldProps<T, WithLabelFieldData>> = (props) => {
  const defaultCountry = "US";
  const [mask, setMask] = React.useState<Mask | undefined>(undefined);
  const [maskPlaceholder, setMaskPlaceholder] = React.useState<
    string | undefined
  >(undefined);

  const i18n = useI18n();

  const onCountryChange = (iso: string) => {
    const country = countries.find((c) => c.iso === iso);
    const countryMask =
      country?.mask && Array.isArray(country?.mask)
        ? country?.mask[0]
        : (country?.mask as string);

    const maskPlaceholder = countryMask
      ? `${country?.code} ${countryMask?.replaceAll("#", "_")}`
      : "";
    const mask = countryMask
      ? `${country?.code} ${countryMask}`
          .split("")
          .map((c) => (c === "#" ? /[0-9]/ : c))
      : undefined;

    setMask(mask);
    setMaskPlaceholder(maskPlaceholder);
  };

  React.useEffect(() => onCountryChange(defaultCountry), []);

  const countryTransform = (country: (typeof countries)[number]) => ({
    value: country.iso,
    shortLabel: (
      <div title={country.name} className="flex">
        <label className="sr-only">{country.name}</label>
        <div
          className={`self-center mr-2 flag ${country.iso.toLocaleLowerCase()}`}
        ></div>
        <div>{country.code}</div>
      </div>
    ),
    label: (
      <div title={country.name} className="flex justify-between w-full">
        <div className="flex">
          <div
            className={`self-center mr-2 flag ${country.iso.toLocaleLowerCase()}`}
          ></div>
          <label>{country.name}</label>
        </div>
        <div>{country.code}</div>
      </div>
    ),
  });

  const countryList = React.useMemo(() => countries.map(countryTransform), []);

  return (
    <FormField
      control={props.control}
      name={getFieldName(props)}
      render={({ field }) => (
        <FormItem>
          <FormFieldLabel
            label={props.data.label || "form_phone_label"}
            required={props.required}
          />
          <FormControl>
            <InputGroup>
              <InputSuffix className="border-r-0 rounded-r-none">
                <label htmlFor="countryCode" className="sr-only">
                  Country code
                </label>
                <Combobox
                  className="*:border-r-0 *:rounded-r-none focus:ring-0 min-w-fit"
                  value={defaultCountry}
                  onItemSelect={(value: string) => onCountryChange(value)}
                  values={countryList}
                  listClassName="w-[400px]"
                  searchLabel={i18n("search_country_code_label")}
                  customSearch={(search) => {
                    const lowerSearch = search.toLocaleLowerCase();
                    return countries
                      .filter(
                        (c) =>
                          c.name.toLocaleLowerCase().indexOf(lowerSearch) >=
                            0 ||
                          c.iso.toLocaleLowerCase().indexOf(lowerSearch) >= 0 ||
                          c.code.toLocaleLowerCase().indexOf(lowerSearch) >= 0
                      )
                      .map(countryTransform);
                  }}
                />
              </InputSuffix>
              <InputGroupInput>
                <MaskedInput
                  {...field}
                  mask={mask}
                  className={InputGroupInputClasses({ variant: "prefix" })}
                  placeholder={maskPlaceholder}
                />
              </InputGroupInput>
            </InputGroup>
          </FormControl>
          <FormFieldDescription description={props.data?.description} />
          <FormFieldErrorMessage />
        </FormItem>
      )}
    />
  );
};
