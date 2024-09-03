import { FormLabel } from "@/components/ui/form";
import { I18nKeys, useI18n } from "@/i18n/i18n";

export const FormFieldLabel: React.FC<{
  label: I18nKeys | string;
  required: boolean;
}> = (props) => {
  const i18n = useI18n();
  return (
    <FormLabel>
      {i18n(props.label as I18nKeys)}
      {props.required && <span className="ml-1">*</span>}
    </FormLabel>
  );
};
