"use client";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { updateHeaderConfiguration } from "./actions";
import { Sortable } from "@/components/ui/sortable";
import { MenuItemCard } from "@/components/admin/menuItem/menuItemCard";
import { SaveButton } from "@/components/admin/forms/save-button";
import {
  HeaderConfiguration,
  headerConfigurationSchema,
  LinkMenuItem,
} from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

export const HeaderSettingsForm: React.FC<{
  values: HeaderConfiguration;
}> = ({ values }) => {
  const form = useForm<HeaderConfiguration>({
    resolver: zodResolver(headerConfigurationSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: HeaderConfiguration) => {
    try {
      setLoading(true);
      await updateHeaderConfiguration(data);
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

  const { fields, append, remove, swap, update } = useFieldArray({
    control: form.control,
    name: "menu",
  });

  const ids = useMemo(() => fields.map((x) => x.id), [fields]);

  const sort = (activeId: string, overId: string) => {
    const activeIndex = fields.findIndex((x) => x.id === activeId);
    const overIndex = fields.findIndex((x) => x.id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swap(activeIndex, overIndex);
  };

  const addNew = () => {
    append({
      type: "link",
    } as Partial<LinkMenuItem> as LinkMenuItem);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="flex gap-3 flex-col">
          <FormField
            control={form.control}
            name="showLogo"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="showLogo"
                    disabled={loading}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel htmlFor="showLogo" className="cursor-pointer">
                    Show logo
                  </FormLabel>
                </div>
                <FormDescription>
                  Should be logo showed in header
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Sortable title="Menu" ids={ids} onSort={sort} onAdd={addNew}>
            <div className="flex flex-grow flex-col gap-4">
              {fields.map((item, index) => {
                return (
                  <MenuItemCard
                    form={form}
                    item={item}
                    key={item.id}
                    name={`menu.${index}`}
                    disabled={loading}
                    remove={() => remove(index)}
                    update={(newValue) => update(index, newValue)}
                  />
                );
              })}
            </div>
          </Sortable>
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
