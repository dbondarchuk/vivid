import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AppointmentOption, FieldSchema, FieldType } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SelectFieldOptionCard } from "./selectFieldOptionCard";
import { Sortable } from "@/components/ui/sortable";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { SupportsMarkdownTooltip } from "@/components/admin/tooltip/supportsMarkdown";
import { Textarea } from "@/components/ui/textarea";

export const fieldTypeLabels: Record<FieldType, string> = {
  email: "Email",
  name: "Name",
  phone: "Phone",
  oneLine: "One line",
  multiLine: "Multi line",
  checkbox: "Checkbox",
  select: "Select",
};

const fieldTypeValues = Object.entries(fieldTypeLabels).map(
  ([value, label]) => ({ value, label } as IComboboxItem)
);

export type FieldProps = {
  item: FieldSchema;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  remove: () => void;
  update: (newValue: FieldSchema) => void;
  clone: () => void;
};

export type FielDragdType = "Field";

export interface FieldDragData {
  type: FielDragdType;
  item: FieldSchema;
}

export const FieldCard: React.FC<FieldProps> = ({
  item,
  form,
  name,
  disabled,
  remove,
  update,
  clone,
}) => {
  const nameValue = form.getValues(`${name}.name`);

  const { fields: options, update: updateOption } = useFieldArray({
    control: form.control,
    name: "options",
    keyName: "fields_id",
  });

  const removeField = () => {
    (options as unknown as AppointmentOption[]).forEach((option, index) => {
      const fields = option.fields?.filter((fields) => fields.id !== item.id);
      updateOption(index, {
        ...option,
        fields,
      });
    });

    remove();
  };

  const {
    fields: selectOptionsFields,
    append: appendSelectOption,
    remove: removeSelectOption,
    swap: swapSelectOptions,
    update: updateSelectOption,
  } = useFieldArray({
    control: form.control,
    name: `${name}.data.options`,
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

  return (
    <Card>
      <AccordionItem value={item.id}>
        <CardHeader className="justify-between relative flex flex-row items-center border-b-2 border-secondary px-3 py-3 w-full">
          <div className="hidden md:block">&nbsp;</div>
          <AccordionTrigger
            className={cn(
              "w-full text-center",
              !nameValue && "text-destructive"
            )}
          >
            {nameValue || "Invalid field"}
          </AccordionTrigger>
          <div className="flex flex-row gap-2">
            <Button
              disabled={disabled}
              variant="outline"
              className=""
              size="sm"
              type="button"
              title="Clone"
              onClick={clone}
            >
              <Copy size={20} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={disabled}
                  variant="destructive"
                  className=""
                  size="sm"
                  type="button"
                  title="Remove"
                >
                  <Trash size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <p>Are you sure you want to remove this field?</p>
                    <p>
                      <strong>NOTE: </strong>This will also remove this field
                      from all the options
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={removeField}>
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <AccordionContent>
          <CardContent className="px-3 pb-6 pt-3 text-left relative grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`${name}.name`}
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
                      disabled={disabled}
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
              name={`${name}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Combobox
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={fieldTypeValues}
                      searchLabel="Select field type"
                      value={field.value}
                      onItemSelect={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.data.label`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Label{" "}
                    <InfoTooltip>
                      Label that will be displayed for the field
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input disabled={disabled} placeholder="Label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.data.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <InfoTooltip>
                      Helper text to show with the field
                    </InfoTooltip>
                    <SupportsMarkdownTooltip supportsMdx />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      autoResize
                      disabled={disabled}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.required`}
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
            {form.getValues(`${name}.type`) === "select" && (
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
                        item={item as unknown as { option: string }}
                        key={item.id}
                        name={`${name}.data.options.${index}`}
                        disabled={disabled}
                        remove={() => removeSelectOption(index)}
                        update={(newValue) =>
                          updateSelectOption(index, newValue)
                        }
                      />
                    );
                  })}
                </div>
              </Sortable>
            )}
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};
