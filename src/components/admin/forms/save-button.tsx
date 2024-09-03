import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import React from "react";
import { UseFormReturn, useFormState } from "react-hook-form";

export type SaveButtonProps = {
  form: UseFormReturn<any>;
  disabled?: boolean;
};

export const SaveButton: React.FC<SaveButtonProps> = ({ form, disabled }) => {
  const { isValid, isDirty } = useFormState(form);

  // React.useEffect(() => {
  //   form.trigger();
  // }, [form]);

  return (
    <Button
      disabled={disabled || !isDirty || !isValid}
      className="ml-auto self-end rounded-full fixed bottom-4 right-4 h-16 w-16"
      type="submit"
    >
      <Save size={30} />
    </Button>
  );
};
