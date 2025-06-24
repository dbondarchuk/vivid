import { I18nKeys, TranslationKeys, useI18n } from "@vivid/i18n";
import { cn, FormLabel } from "@vivid/ui";

export const FormFieldLabel: React.FC<{
  label: TranslationKeys | string;
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
      {i18n(props.label as TranslationKeys)}
      {props.required && <span className="ml-1">*</span>}
    </FormLabel>
  );
};
