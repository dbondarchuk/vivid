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
import { FieldType } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Copy, GripVertical, Trash } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { OptionSchema } from "./optionsCard";
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

const [firstFieldType, ...restFieldTypes] = Object.values(FieldType);

export const fieldTypeLabels: Record<FieldType, string> = {
  email: "Email",
  name: "Name",
  phone: "Phone",
  oneLine: "One line",
  multiLine: "Multi line",
};

const fieldTypeValues = Object.entries(fieldTypeLabels).map(
  ([value, label]) => ({ value, label } as IComboboxItem)
);

export const fieldSchema = z.object({
  name: z
    .string()
    .min(2, "Field name must me at least 2 characters long")
    .refine(
      (s) => /^[a-z_][a-z0-9_]+$/i.test(s),
      "Field name must start with letter and contain only letters, digits, and underscore (_)"
    ),
  id: z.string(),
  type: z.enum([firstFieldType, ...restFieldTypes], {
    required_error: "Unknown field type",
  }),
  data: z.object({
    label: z.string().min(1, "Field label is required"),
  }),
  required: z.boolean().optional(),
});

export type FieldSchema = z.infer<typeof fieldSchema>;

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
    (options as unknown as OptionSchema[]).forEach((option, index) => {
      const fields = option.fields?.filter((fields) => fields.id !== item.id);
      updateOption(index, {
        ...option,
        fields,
      });
    });

    remove();
  };

  return (
    <Card>
      <CardHeader className="justify-between relative flex flex-row items-center border-b-2 border-secondary px-3 py-3 w-full">
        <div className="w-full text-center">{nameValue || "Invalid field"}</div>
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
                    <strong>NOTE: </strong>This will also remove this field from
                    all the options
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
      <CardContent className="px-3 pb-6 pt-3 text-left relative grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${name}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name{" "}
                <InfoTooltip>
                  Unique ID of the field. Can contain only letter, digits, and
                  underscore
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
      </CardContent>
    </Card>
  );
};
