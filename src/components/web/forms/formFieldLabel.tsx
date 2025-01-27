import { FormLabel } from "@/components/ui/form";
import { I18nKeys, useI18n } from "@/i18n/i18n";

export const FormFieldLabel: React.FC<{
  label: I18nKeys | string;
  required?: boolean;
  className?: string;
}> = (props) => {
  const i18n = useI18n();
  return (
    <FormLabel className={props.className}>
      {i18n(props.label as I18nKeys)}
      {props.required && <span className="ml-1">*</span>}
    </FormLabel>
  );
};
