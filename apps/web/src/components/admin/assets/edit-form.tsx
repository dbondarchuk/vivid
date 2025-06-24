"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import { AssetEntity } from "@vivid/types";
import {
  AssetPreview,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SaveButton,
  Textarea,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateAsset } from "./actions";

const formSchema = z.object({
  description: z.coerce.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AssetEditForm: React.FC<{ asset: AssetEntity }> = ({ asset }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const t = useI18n("admin");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      description: asset.description,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      await toastPromise(updateAsset(asset._id, data), {
        success: t("assets.toasts.changesSaved"),
        error: t("common.toasts.error"),
      });

      router.refresh();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="w-full flex items-center justify-center">
          <AssetPreview asset={asset} size="lg" />
        </div>
        <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
          <FormItem>
            <FormLabel>{t("assets.form.fileName")}</FormLabel>
            <Input
              disabled={true}
              placeholder={t("assets.form.assetName")}
              value={asset.filename}
            />
          </FormItem>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("assets.form.description")}</FormLabel>
                <FormControl>
                  <Textarea
                    autoResize
                    disabled={loading}
                    placeholder={t("assets.form.descriptionPlaceholder")}
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
