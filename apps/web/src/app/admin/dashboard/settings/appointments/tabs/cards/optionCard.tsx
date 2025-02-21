import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AppointmentOption, WithDatabaseId } from "@vivid/types";
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
import { cva } from "class-variance-authority";
import { Copy, GripVertical, Trash } from "lucide-react";
import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AddonSelectCard } from "./addonSelectCard";
import { FieldSelectCard } from "./fieldSelectCard";

export type OptionProps = {
  item: AppointmentOption;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: AppointmentOption) => void;
  clone: () => void;
};

export type OptionType = "Option";

export interface OptionDragData {
  type: OptionType;
  item: AppointmentOption;
}

export const OptionCard: React.FC<OptionProps> = ({
  item,
  form,
  name,
  disabled,
  isOverlay,
  remove,
  update,
  clone,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: "Option",
      item,
    } satisfies OptionDragData,
    attributes: {
      roleDescription: "Option",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const nameValue = form.getValues(`${name}.name`);

  const {
    fields: addonsFields,
    append: appendAddon,
    remove: removeAddon,
    swap: swapAddons,
    update: updateAddon,
  } = useFieldArray({
    control: form.control,
    name: `${name}.addons`,
    keyName: "fields_id",
  });

  const addonsFieldsIds = addonsFields.map((x) => x.fields_id);
  const [openedAddons, setOpenedAddons] = React.useState<string[]>([]);

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

  const collapseAddons = () => {
    setOpenedAddons(openedAddons.length > 0 ? [] : addonsFieldsIds);
  };

  const collapseFields = () => {
    setOpenedFields(openedFields.length > 0 ? [] : fieldsFieldsIds);
  };

  const hasError = form.getFieldState(name).invalid;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <AccordionItem value={item.id}>
        <CardHeader className="justify-between relative flex flex-row border-b-2 border-secondary px-3 py-3 w-full">
          <Button
            type="button"
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
          >
            <></>
            <span className="sr-only">Move appointment option</span>
            <GripVertical />
          </Button>
          <AccordionTrigger className={cn(hasError && "text-destructive")}>
            {nameValue || "Invalid option"}
          </AccordionTrigger>

          <div className="flex flex-row gap-2 items-center">
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
                    Are you sure you want to remove this option?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={remove}>
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
                    <InputGroup>
                      <InputGroupInput>
                        <Input
                          disabled={disabled}
                          placeholder="30"
                          type="number"
                          className={InputGroupInputClasses()}
                          {...field}
                        />
                      </InputGroupInput>
                      <InputSuffix className={InputGroupSuffixClasses()}>
                        minutes
                      </InputSuffix>
                    </InputGroup>
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
            <Sortable
              title="Addons"
              ids={addonsFieldsIds}
              onSort={sortAddons}
              onAdd={addNewAddon}
              collapse={collapseAddons}
              allCollapsed={
                openedAddons.length === 0 && addonsFieldsIds.length > 0
              }
            >
              <Accordion
                type="multiple"
                value={openedAddons}
                onValueChange={setOpenedAddons}
              >
                <div className="flex flex-grow flex-col gap-4">
                  {addonsFields.map((item, index) => {
                    return (
                      <AddonSelectCard
                        form={form}
                        item={item as WithDatabaseId<any>}
                        key={(item as WithDatabaseId<any>).id}
                        name={`${name}.addons.${index}`}
                        disabled={disabled}
                        remove={() => removeAddon(index)}
                        update={(newValue) => updateAddon(index, newValue)}
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
