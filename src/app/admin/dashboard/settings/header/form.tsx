"use client";

import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { updateHeaderConfiguration } from "./actions";
import { Sortable } from "@/components/ui/sortable";
import { MenuItemCard } from "@/components/admin/menuItem/menuItemCard";
import {
  LinkMenuItemSchema,
  menuItemsSchema,
} from "@/components/admin/menuItem/schema";
import { SaveButton } from "@/components/admin/forms/save-button";

const formSchema = z.object({
  menu: menuItemsSchema,
});

type FormValues = z.infer<typeof formSchema>;

export const HeaderSettingsForm: React.FC<{
  values: FormValues;
}> = ({ values }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
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
    } as Partial<LinkMenuItemSchema> as LinkMenuItemSchema);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="gap-8 flex-col">
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
