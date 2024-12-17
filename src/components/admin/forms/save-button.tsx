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

export type SaveButtonProps = {
  form: UseFormReturn<any>;
  disabled?: boolean;
};

export const SaveButton: React.FC<SaveButtonProps> = ({ form, disabled }) => {
  const { isValid, isDirty, errors } = useFormState(form);

  const classes = cva([
    "ml-auto self-end rounded-full fixed bottom-4 right-4 h-16 w-16",
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

  return (
    <Button
      disabled={disabled || !isDirty || !isValid}
      className={classes()}
      type="submit"
    >
      <Save size={30} />
    </Button>
  );
};
