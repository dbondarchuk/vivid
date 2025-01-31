import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import React from "react";
import { UseFormReturn, useFormState } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cva } from "class-variance-authority";
import { Spinner } from "@/components/ui/spinner";

export type SaveButtonProps = {
  form: UseFormReturn<any>;
  disabled?: boolean;
  isLoading?: boolean;
  text?: string;
};

export const SaveButton: React.FC<SaveButtonProps> = ({
  form,
  disabled,
  isLoading: propsIsLoading,
  text = "Save",
}) => {
  const {
    isValid,
    isDirty,
    isLoading: formIsLoading,
    errors,
  } = useFormState(form);

  const classes = cva([
    "flex flex-row gap-2 items-center ml-auto self-end fixed bottom-4 right-4",
  ]);

  // React.useEffect(() => {
  //   form.trigger();
  // }, [form]);

  // if (!isValid && errors) {
  //   return (
  //     <AlertDialog>
  //       <AlertDialogTrigger asChild>
  //         <Button
  //           disabled={disabled || !isDirty}
  //           className={classes()}
  //           type="button"
  //         >
  //           <Save size={30} />
  //         </Button>
  //       </AlertDialogTrigger>
  //       <AlertDialogContent>
  //         <AlertDialogHeader>
  //           <AlertDialogTitle>Please fix following errors</AlertDialogTitle>
  //           <AlertDialogDescription>
  //             {Object.entries(errors)
  //               .filter(([_, error]) => !!error?.message)
  //               .map(([key, error]) => (
  //                 <div key={key} className="text-destructive">
  //                   {error?.message?.toString()}
  //                 </div>
  //               ))}
  //           </AlertDialogDescription>
  //         </AlertDialogHeader>
  //         <AlertDialogFooter>
  //           <AlertDialogCancel>Close</AlertDialogCancel>
  //         </AlertDialogFooter>
  //       </AlertDialogContent>
  //     </AlertDialog>
  //   );
  // }

  const isLoading = propsIsLoading || formIsLoading;

  return (
    <Button
      disabled={disabled || isLoading || !isDirty || !isValid}
      className={classes()}
      type="submit"
    >
      {isLoading ? <Spinner /> : <Save />}
      <span>{text}</span>
    </Button>
  );
};
