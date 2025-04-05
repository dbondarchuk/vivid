"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlateMarkdownEditor } from "@vivid/rte";
import {
  AppointmentOption,
  AppointmentOptionUpdateModel,
  DatabaseId,
  getAppointmentOptionSchemaWithUniqueCheck,
  WithDatabaseId,
} from "@vivid/types";
import {
  DurationInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  SaveButton,
  Sortable,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { FieldSelectCard } from "../field-select-card";
import { checkUniqueName, create, update } from "./actions";
import { AddonSelectCard } from "./addon-select-card";

export const OptionForm: React.FC<{
  initialData?: AppointmentOptionUpdateModel & Partial<DatabaseId>;
}> = ({ initialData }) => {
  const formSchema = getAppointmentOptionSchemaWithUniqueCheck(
    (slug) => checkUniqueName(slug, initialData?._id),
    "Option name must be unique"
  );

  type FormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData?._id) {
          const { _id } = await create(data);
          router.push(`/admin/dashboard/services/options/${_id}`);
        } else {
          await update(initialData._id, data);

          router.refresh();
        }
      };

      await toastPromise(fn(), {
        success: "Your changes were saved.",
        error: "There was a problem with your request.",
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const {
    fields: fieldsFields,
    append: appendField,
    remove: removeField,
    swap: swapFields,
    update: updateField,
  } = useFieldArray({
    control: form.control,
    name: "fields",
    keyName: "fields_id",
  });

  const fieldsFieldsIds = fieldsFields.map((x) => x.fields_id);

  const sortFields = (activeId: string, overId: string) => {
    const activeIndex = fieldsFields.findIndex((x) => x.fields_id === activeId);

    const overIndex = fieldsFields.findIndex((x) => x.fields_id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swapFields(activeIndex, overIndex);
  };

  const addNewField = () => {
    appendField({
      id: "",
    });
  };

  const {
    fields: addonsFields,
    append: appendAddon,
    remove: removeAddon,
    swap: swapAddons,
    update: updateAddon,
  } = useFieldArray({
    control: form.control,
    name: "addons",
    keyName: "fields_id",
  });

  const addonsFieldsIds = addonsFields.map((x) => x.fields_id);

  const sortAddons = (activeId: string, overId: string) => {
    const activeIndex = addonsFields.findIndex((x) => x.fields_id === activeId);

    const overIndex = addonsFields.findIndex((x) => x.fields_id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swapAddons(activeIndex, overIndex);
  };

  const addNewAddon = () => {
    appendAddon({
      id: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Option name"
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
                <FormLabel>
                  Short description{" "}
                  <InfoTooltip>
                    Short text that will be visible during booking
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <PlateMarkdownEditor
                    className="bg-background px-4 sm:px-4 pb-24"
                    disabled={loading}
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <DurationInput {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputSuffix
                        className={InputGroupSuffixClasses({
                          variant: "prefix",
                        })}
                      >
                        $
                      </InputSuffix>
                      <InputGroupInput>
                        <Input
                          disabled={loading}
                          placeholder="20"
                          type="number"
                          className={InputGroupInputClasses({
                            variant: "prefix",
                          })}
                          {...field}
                        />
                      </InputGroupInput>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full  grid md:grid-cols-2 gap-4">
            <Sortable
              title="Fields"
              ids={fieldsFieldsIds}
              onSort={sortFields}
              onAdd={addNewField}
            >
              <div className="flex flex-grow flex-col gap-4">
                {fieldsFields.map((item, index) => {
                  return (
                    <FieldSelectCard
                      form={form}
                      type="option"
                      item={item as WithDatabaseId<any>}
                      key={(item as WithDatabaseId<any>).id}
                      name={`fields.${index}`}
                      disabled={loading}
                      remove={() => removeField(index)}
                      excludeIds={form
                        .getValues("fields")
                        ?.filter(
                          ({ id }) =>
                            id !== form.getValues(`fields.${index}`).id
                        )
                        .map(({ id }) => id)}
                    />
                  );
                })}
              </div>
            </Sortable>
            <Sortable
              title="Addons"
              ids={addonsFieldsIds}
              onSort={sortAddons}
              onAdd={addNewAddon}
            >
              <div className="flex flex-grow flex-col gap-4">
                {addonsFields.map((item, index) => {
                  return (
                    <AddonSelectCard
                      form={form}
                      item={item as WithDatabaseId<any>}
                      key={(item as WithDatabaseId<any>).id}
                      name={`addons.${index}`}
                      disabled={loading}
                      remove={() => removeAddon(index)}
                      excludeIds={form
                        .getValues("addons")
                        ?.filter(
                          ({ id }) =>
                            id !== form.getValues(`addons.${index}`).id
                        )
                        .map(({ id }) => id)}
                    />
                  );
                })}
              </div>
            </Sortable>
          </div>
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
