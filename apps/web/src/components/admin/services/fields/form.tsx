"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import { PlateMarkdownEditor } from "@vivid/rte";
import {
  DatabaseId,
  fieldTypes,
  fileFieldAcceptItemSchema,
  getFieldSchemaWithUniqueCheck,
  ServiceFieldUpdateModel,
} from "@vivid/types";
import {
  Button,
  Combobox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  IComboboxItem,
  InfoTooltip,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  SaveButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sortable,
  Switch,
  TagInput,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { checkUniqueName, create, update } from "./actions";
import { SelectFieldOptionCard } from "./select-field-option-card";

const fileTypes = {
  "image/*": "Images",
  "video/*": "Videos",
  "audio/*": "Audios",
  ".doc,.docx,.pdf": "Documents",
};

const FileTypePickerTag = ({
  onAdd,
}: {
  onAdd: (value: string | string[]) => void;
}) => {
  const t = useI18n("admin");
  const [value, setValue] = React.useState<keyof typeof fileTypes | undefined>(
    "image/*"
  );

  return (
    <div className="flex flex-col gap-2 p-3">
      <Select
        value={value}
        onValueChange={(value) => {
          setValue(value as keyof typeof fileTypes);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("services.fields.form.fileTypes")} />
        </SelectTrigger>
        <SelectContent side="bottom">
          {Object.entries(fileTypes).map(([step, label]) => (
            <SelectItem key={step} value={step}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="default"
        className="w-full"
        onClick={() => {
          if (!value) return;

          onAdd(value.split(","));
        }}
      >
        {t("services.fields.form.addOption")}
      </Button>
    </div>
  );
};

export const ServiceFieldForm: React.FC<{
  initialData?: ServiceFieldUpdateModel & Partial<DatabaseId>;
}> = ({ initialData }) => {
  const t = useI18n("admin");
  const formSchema = getFieldSchemaWithUniqueCheck(
    (slug) => checkUniqueName(slug, initialData?._id),
    "services.fields.nameUnique"
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
          router.push(`/admin/dashboard/services/fields//${_id}`);
        } else {
          await update(initialData._id, data);

          router.refresh();
        }
      };

      await toastPromise(fn(), {
        success: t("services.fields.form.toasts.changesSaved"),
        error: t("services.fields.form.toasts.requestError"),
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const {
    fields: selectOptionsFields,
    append: appendSelectOption,
    remove: removeSelectOption,
    swap: swapSelectOptions,
  } = useFieldArray({
    control: form.control,
    name: `data.options`,
  });

  const sortSelectOptions = (activeId: string, overId: string) => {
    const activeIndex = selectOptionsFields.findIndex((x) => x.id === activeId);

    const overIndex = selectOptionsFields.findIndex((x) => x.id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swapSelectOptions(activeIndex, overIndex);
  };

  const addNewSelectOption = () => {
    appendSelectOption({
      option: "",
    });
  };

  const selectOptionsIds = selectOptionsFields.map((x) => x.id);

  const fieldType = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("services.fields.form.name")}{" "}
                    <InfoTooltip>
                      {t("services.fields.form.nameTooltip")}
                    </InfoTooltip>
                  </FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={t("services.fields.form.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("services.fields.form.label")}{" "}
                    <InfoTooltip>
                      {t("services.fields.form.labelTooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder={t("services.fields.form.labelPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("services.fields.form.type")}{" "}
                    <InfoTooltip>
                      {t("services.fields.form.typeTooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      values={fieldTypes.map((type) => ({
                        value: type,
                        label: t(`common.labels.fieldType.${type}`),
                      }))}
                      searchLabel={t("services.fields.form.typePlaceholder")}
                      value={field.value}
                      onItemSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("services.fields.form.description")}{" "}
                    <InfoTooltip>
                      {t("services.fields.form.descriptionTooltip")}
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
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("services.fields.form.required")}{" "}
                    <InfoTooltip>
                      {t("services.fields.form.requiredTooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {fieldType === "select" && (
            <Sortable
              title={t("services.fields.form.optionsTitle")}
              ids={selectOptionsIds}
              onSort={sortSelectOptions}
              onAdd={addNewSelectOption}
            >
              <div className="flex flex-grow flex-col gap-4">
                {selectOptionsFields.map((item, index) => {
                  return (
                    <SelectFieldOptionCard
                      form={form}
                      item={item}
                      key={item.id}
                      name={`data.options.${index}`}
                      disabled={loading}
                      remove={() => removeSelectOption(index)}
                    />
                  );
                })}
              </div>
            </Sortable>
          )}
          {fieldType === "file" && (
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
              <FormField
                control={form.control}
                name="data.maxSizeMb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("services.fields.form.maxSizeMbLabel")}{" "}
                      <InfoTooltip>
                        {t("services.fields.form.maxSizeMbTooltip")}
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput>
                          <Input
                            disabled={loading}
                            placeholder={t(
                              "services.fields.form.maxSizeMbPlaceholder"
                            )}
                            type="number"
                            className={InputGroupInputClasses()}
                            {...field}
                          />
                        </InputGroupInput>
                        <InputSuffix className={InputGroupSuffixClasses()}>
                          MB
                        </InputSuffix>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data.accept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("services.fields.form.acceptedFilesLabel")}{" "}
                      <InfoTooltip>
                        {t("services.fields.form.acceptedFilesTooltip")}
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        {...field}
                        readOnly
                        placeholder={t(
                          "services.fields.form.acceptedFilesPlaceholder"
                        )}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          field.onBlur();
                        }}
                        tagValidator={fileFieldAcceptItemSchema}
                        addItemTemplate={FileTypePickerTag}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
