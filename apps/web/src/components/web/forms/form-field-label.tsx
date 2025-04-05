import { I18nKeys, useI18n } from "@/i18n/i18n";
import { cn, FormLabel } from "@vivid/ui";

export const FormFieldLabel: React.FC<{
  label: I18nKeys | string;
  required?: boolean;
  className?: string;
  htmlFor?: string;
}> = (props) => {
  const i18n = useI18n();
  return (
    <FormLabel
      className={cn(props.htmlFor && "cursor-pointer", props.className)}
      htmlFor={props.htmlFor}
    >
      {i18n(props.label as I18nKeys)}
      {props.required && <span className="ml-1">*</span>}
    </FormLabel>
  );
};
