"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import { PlateEditor, PlateMarkdownEditor } from "@vivid/rte";
import {
  AppointmentAddon,
  AppointmentAddonUpdateModel,
  DatabaseId,
  getAppointmentAddonSchemaWithUniqueCheck,
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

export const AddonForm: React.FC<{
  initialData?: AppointmentAddonUpdateModel & Partial<DatabaseId>;
}> = ({ initialData }) => {
  const t = useI18n("admin");
  const formSchema = getAppointmentAddonSchemaWithUniqueCheck(
    (slug) => checkUniqueName(slug, initialData?._id),
    "services.addons.nameUnique"
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
          router.push(`/admin/dashboard/services/addons/${_id}`);
        } else {
          await update(initialData._id, data);

          router.refresh();
        }
      };

      await toastPromise(fn(), {
        success: t("services.addons.form.toasts.changesSaved"),
        error: t("services.addons.form.toasts.requestError"),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("services.addons.form.name")}</FormLabel>

                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder={t("services.addons.form.namePlaceholder")}
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
                  {t("services.addons.form.description")}{" "}
                  <InfoTooltip>
                    {t("services.addons.form.descriptionTooltip")}
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
                  <FormLabel>{t("services.addons.form.duration")}</FormLabel>
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
                  <FormLabel>{t("services.addons.form.price")}</FormLabel>
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
                          placeholder={t(
                            "services.addons.form.pricePlaceholder"
                          )}
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
          <Sortable
            title={t("services.addons.form.fields")}
            ids={fieldsFieldsIds}
            onSort={sortFields}
            onAdd={addNewField}
          >
            <div className="flex flex-grow flex-col gap-4">
              {fieldsFields.map((item, index) => {
                return (
                  <FieldSelectCard
                    form={form}
                    type="addon"
                    item={item as WithDatabaseId<any>}
                    key={(item as WithDatabaseId<any>).id}
                    name={`fields.${index}`}
                    disabled={loading}
                    remove={() => removeField(index)}
                    excludeIds={form
                      .getValues("fields")
                      ?.filter(
                        ({ id }) => id !== form.getValues(`fields.${index}`).id
                      )
                      .map(({ id }) => id)}
                  />
                );
              })}
            </div>
          </Sortable>
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
