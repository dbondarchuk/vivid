"use client";

import { FieldTypeLabels } from "@/constants/labels";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlateMarkdownEditor } from "@vivid/rte";
import {
  DatabaseId,
  fileFieldAcceptItemSchema,
  getFieldSchemaWithUniqueCheck,
  ServiceField,
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
  Link,
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

const fieldTypeValues = Object.entries(FieldTypeLabels).map(
  ([value, label]) => ({ value, label }) as IComboboxItem
);

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
          <SelectValue placeholder="Select file type" />
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
        Add
      </Button>
    </div>
  );
};

export const ServiceFieldForm: React.FC<{
  initialData?: ServiceFieldUpdateModel & Partial<DatabaseId>;
}> = ({ initialData }) => {
  const formSchema = getFieldSchemaWithUniqueCheck(
    (slug) => checkUniqueName(slug, initialData?._id),
    "Field name must be unique"
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
                    Name{" "}
                    <InfoTooltip>
                      Unique ID of the field. Can contain only letter, digits,
                      and underscore
                    </InfoTooltip>
                  </FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Field name"
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
                    Label{" "}
                    <InfoTooltip>
                      Label that will be displayed for the field
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="data.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Help text{" "}
                  <InfoTooltip>Helper text to show with the field</InfoTooltip>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Combobox
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      values={fieldTypeValues}
                      searchLabel="Select field type"
                      value={field.value}
                      onItemSelect={(item) => {
                        field.onChange(item);
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Required{" "}
                    <InfoTooltip>Marks field as to be required</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <div className="!mt-4">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {fieldType === "select" && (
            <Sortable
              title="Options"
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
                      Max file size{" "}
                      <InfoTooltip>
                        Max allowed file size in megabytes
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput>
                          <Input
                            disabled={loading}
                            placeholder="5"
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
                      Accepted files{" "}
                      <InfoTooltip>
                        List of accepted file and file types based on{" "}
                        <Link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers">
                          https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
                        </Link>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        {...field}
                        readOnly
                        placeholder="Click plus button to add new file type"
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
