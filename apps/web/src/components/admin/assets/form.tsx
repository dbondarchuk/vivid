"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SaveButton,
  Textarea,
  useToast,
} from "@vivid/ui";
import mimeType from "mime-type/with-db";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkUniqueFileName, createAsset } from "./actions";

const formSchema = z.object({
  files: z.array(z.any()).min(1, "File must be attached"),
  filename: z
    .string()
    .min(3, { message: "File name must be at least 3 characters" })
    .regex(/^[\w,\s-]+\.[A-Za-z0-9]{1,6}$/gi, "File name must have an exension")
    .refine((filename) => checkUniqueFileName(filename), {
      message: "File name must be unique",
    }),
  mimeType: z.string(),
  description: z.string().optional(),
});

type FileFormValues = z.infer<typeof formSchema>;

export const AssetForm: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FileFormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      files: [],
    },
  });

  const files = form.watch("files");
  const filename = files?.[0]?.name;
  React.useEffect(() => {
    if (filename) {
      let fileType = mimeType.lookup(filename);
      if (!fileType) {
        fileType = "application/octet-stream";
      } else if (Array.isArray(fileType)) {
        fileType = fileType[0];
      }

      form.setValue("filename", filename);
      form.setValue("mimeType", fileType);
      form.trigger("filename");
    }
  }, [filename, form]);

  const onSubmit = async (data: FileFormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();
      const { files, ...rest } = data;

      formData.append("file", files[0]);
      Object.entries(rest).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await createAsset(formData);

      router.push(`/admin/dashboard/assets`);
      router.refresh();

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FileInput name="files" label="Asset" />
        <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="filename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Asset file name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    autoResize
                    disabled={loading}
                    placeholder="Asset description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
