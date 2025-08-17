import { TranslationKeys, useI18n } from "@vivid/i18n";
import { FormLabel } from "../form";
import { cn } from "../../utils";

export const FormFieldLabel: React.FC<{
  label: TranslationKeys | string;
  required?: boolean;
  className?: string;
  htmlFor?: string;
}> = (props) => {
  const i18n = useI18n("translation");
  const hasKey = i18n.has(props.label as TranslationKeys);
  return (
    <FormLabel
      className={cn(props.htmlFor && "cursor-pointer", props.className)}
      htmlFor={props.htmlFor}
    >
      {hasKey ? i18n(props.label as TranslationKeys) : props.label}
      {props.required && <span className="ml-1">*</span>}
    </FormLabel>
  );
};
