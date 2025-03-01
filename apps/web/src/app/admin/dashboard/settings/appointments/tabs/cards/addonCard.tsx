import {
  AppointmentAddon,
  AppointmentOption,
  WithDatabaseId,
} from "@vivid/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  cn,
  DurationInput,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  Sortable,
  SupportsMarkdownTooltip,
  Textarea,
} from "@vivid/ui";
import { Copy, Trash } from "lucide-react";
import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FieldSelectCard } from "./fieldSelectCard";

export type AddonProps = {
  item: AppointmentAddon;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  remove: () => void;
  update: (newValue: AppointmentAddon) => void;
  clone: () => void;
};

export type AddonType = "Addon";

export interface AddonDragData {
  type: AddonType;
  item: AppointmentAddon;
}

export const AddonCard: React.FC<AddonProps> = ({
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

  const removeAddon = () => {
    (options as unknown as AppointmentOption[]).forEach((option, index) => {
      const addons = option.addons?.filter((addon) => addon.id !== item.id);
      updateOption(index, {
        ...option,
        addons,
      });
    });

    remove();
  };

  const {
    fields: fieldsFields,
    append: appendField,
    remove: removeField,
    swap: swapFields,
    update: updateField,
  } = useFieldArray({
    control: form.control,
    name: `${name}.fields`,
    keyName: "fields_id",
  });

  const fieldsFieldsIds = fieldsFields.map((x) => x.fields_id);
  const [openedFields, setOpenedFields] = React.useState<string[]>([]);

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

  const collapseFields = () => {
    setOpenedFields(openedFields.length > 0 ? [] : fieldsFieldsIds);
  };

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
            {nameValue || "Invalid addon"}
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
                    <p>Are you sure you want to remove this addon?</p>
                    <p>
                      <strong>NOTE: </strong>This will also remove this addon
                      from all the options
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={removeAddon}>
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
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      disabled={disabled}
                      placeholder="Addon name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <SupportsMarkdownTooltip supportsMdx />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-9"
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
              name={`${name}.duration`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <DurationInput {...field} disabled={disabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${name}.price`}
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
                          disabled={disabled}
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
            <Sortable
              title="Fields"
              ids={fieldsFieldsIds}
              onSort={sortFields}
              onAdd={addNewField}
              collapse={collapseFields}
              allCollapsed={
                openedFields.length === 0 && fieldsFieldsIds.length > 0
              }
            >
              <Accordion
                type="multiple"
                value={openedFields}
                onValueChange={setOpenedFields}
              >
                <div className="flex flex-grow flex-col gap-4">
                  {fieldsFields.map((item, index) => {
                    return (
                      <FieldSelectCard
                        form={form}
                        type="option"
                        item={item as WithDatabaseId<any>}
                        key={(item as WithDatabaseId<any>).id}
                        name={`${name}.fields.${index}`}
                        disabled={disabled}
                        remove={() => removeField(index)}
                        update={(newValue) => updateField(index, newValue)}
                      />
                    );
                  })}
                </div>
              </Accordion>
            </Sortable>
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};
