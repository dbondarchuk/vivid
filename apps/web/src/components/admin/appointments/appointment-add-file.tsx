"use client";

import { useI18n } from "@vivid/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetEntity } from "@vivid/types";
import { Button, DndFileInput, Form, Spinner, toastPromise } from "@vivid/ui";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addAppointmentFiles } from "./actions";

export type AppointmentAddFileProps = {
  appointmentId: string;
  onSuccess: (assets: AssetEntity[]) => void;
};

const formSchema = z.object({
  files: z.array(z.any()).min(1, "File must be attached"),
});

type FileFormValues = z.infer<typeof formSchema>;

export const AppointmentAddFile: React.FC<AppointmentAddFileProps> = ({
  appointmentId,
  onSuccess,
}) => {
  const t = useI18n("admin");
  const [loading, setLoading] = React.useState(false);

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

      const assets = await toastPromise(addAppointmentFiles(formData), {
        success: t("appointments.addFile.success"),
        error: t("appointments.addFile.error"),
      });

      form.reset();
      onSuccess(assets);
    } catch (error: any) {
      console.error(error);
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
        <DndFileInput name="files" disabled={loading} />
        <Button
          variant="default"
          className="w-full"
          disabled={loading || !form.formState.isValid}
        >
          {t("appointments.addFile.upload")}
        </Button>
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
            <div role="status">
              <Spinner className="w-20 h-20" />
              <span className="sr-only">
                {t("appointments.addFile.pleaseWait")}
              </span>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
