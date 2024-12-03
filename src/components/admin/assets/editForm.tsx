"use client";
import { SaveButton } from "@/components/admin/forms/save-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Asset } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateAsset } from "./actions";
import mimeType from "mime-type/with-db";
import Image from "next/image";

const formSchema = z.object({
  description: z.coerce.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AssetEditForm: React.FC<{ asset: Asset }> = ({ asset }) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
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

      await updateAsset(asset._id, data);

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
        {mimeType.lookup(asset.filename)?.toString().startsWith("image/") && (
          <div className="w-full flex items-center justify-center">
            <Image
              src={`/assets/${asset.filename}`}
              width={500}
              height={500}
              alt={asset.filename}
            />
          </div>
        )}
        <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
          <FormItem>
            <FormLabel>File name</FormLabel>
            <Input
              disabled={true}
              placeholder="Asset name"
              value={asset.filename}
            />
          </FormItem>
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
