"use client";

import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateScriptsConfiguration } from "./actions";
import { SaveButton } from "@/components/admin/forms/save-button";
import { ResourcesCard } from "@/components/admin/resource/resources.card";
import { ScriptsConfiguration, scriptsConfigurationSchema } from "@/types";

export const ScriptsSettingsForm: React.FC<{
  values: ScriptsConfiguration;
}> = ({ values }) => {
  const form = useForm<ScriptsConfiguration>({
    resolver: zodResolver(scriptsConfigurationSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: ScriptsConfiguration) => {
    try {
      setLoading(true);
      await updateScriptsConfiguration(data);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="flex gap-8 flex-col">
          <ResourcesCard
            type="script"
            form={form}
            name="header"
            title="Header scripts"
            loading={loading}
          />
          <ResourcesCard
            type="script"
            form={form}
            name="footer"
            title="Footer scripts"
            loading={loading}
          />
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
