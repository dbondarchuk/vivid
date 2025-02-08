"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FileInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SaveButton,
  Spinner,
  Textarea,
  useToast,
} from "@vivid/ui";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addAppointmentFiles } from "./actions";
import { Asset } from "@vivid/types";

export type AppointmentAddFileProps = {
  appointmentId: string;
  onSuccess: (assets: Asset[]) => void;
};

const formSchema = z.object({
  files: z.array(z.any()).min(1, "File must be attached"),
});

type FileFormValues = z.infer<typeof formSchema>;

export const AppointmentAddFile: React.FC<AppointmentAddFileProps> = ({
  appointmentId,
  onSuccess,
}) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FileFormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = async (data: FileFormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();
      const { files, ...rest } = data;

      formData.append("file", files[0]);
      formData.append("appointmentId", appointmentId);

      const assets = await addAppointmentFiles(formData);

      form.reset();
      onSuccess(assets);

      toast({
        variant: "default",
        title: "Saved",
        description: "Your changes were saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2 relative"
      >
        <FileInput name="files" disabled={loading} />
        <Button
          variant="default"
          className="w-full"
          disabled={loading || !form.formState.isValid}
        >
          Upload
        </Button>
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
            <div role="status">
              <Spinner className="w-20 h-20" />
              <span className="sr-only">Please wait...</span>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
