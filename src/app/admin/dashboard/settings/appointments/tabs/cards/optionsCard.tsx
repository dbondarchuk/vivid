import {
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "@/components/admin/forms/inputGroupClasses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputSuffix,
} from "@/components/ui/inputGroup";
import { Sortable } from "@/components/ui/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { AddonSelectCard } from "./addonSelectCard";
import { FieldSelectCard } from "./fieldSelectCard";
import { SupportsMarkdownTooltip } from "@/components/admin/tooltip/supportsMarkdown";
import { Textarea } from "@/components/ui/textarea";
import { WithId } from "@/types";

export const optionSchema = z.object({
  name: z.string().min(2, "Option name must me at least 2 characters long"),
  id: z.string(),
  description: z
    .string()
    .min(2, "Option description must be at least 2 characters long"),
  duration: z.coerce
    .number()
    .min(0, "Option duration must be at least 0 minutes")
    .optional(),
  price: z.coerce.number().min(0, "Option price must be at least 0").optional(),
  addons: z
    .array(
      z.object({
        id: z.string().min(1, "Addon id is required"),
      })
    )
    .optional(),
  fields: z
    .array(
      z.object({
        id: z.string().min(1, "Field id is required"),
      })
    )
    .optional(),
});

export type OptionSchema = z.infer<typeof optionSchema>;

export type OptionProps = {
  item: OptionSchema;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: OptionSchema) => void;
};

export type OptionType = "Option";

export interface OptionDragData {
  type: OptionType;
  item: OptionSchema;
}

export const OptionCard: React.FC<OptionProps> = ({
  item,
  form,
  name,
  disabled,
  isOverlay,
  remove,
  update,
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

  const sortAddons = (activeId: string, overId: string) => {
    const activeIndex = addonsFields.findIndex(
      (x: WithId<any>) => x.id === activeId
    );

    const overIndex = addonsFields.findIndex(
      (x: WithId<any>) => x.id === overId
    );

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

  const sortFields = (activeId: string, overId: string) => {
    const activeIndex = fieldsFields.findIndex(
      (x: WithId<any>) => x.id === activeId
    );

    const overIndex = fieldsFields.findIndex(
      (x: WithId<any>) => x.id === overId
    );

    if (activeIndex < 0 || overIndex < 0) return;

    swapFields(activeIndex, overIndex);
  };

  const addNewField = () => {
    appendField({
      id: "",
    });
  };

  const addonsIds = addonsFields.map((x: WithId<any>) => x.id);
  const fieldsIds = fieldsFields.map((x: WithId<any>) => x.id);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
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
        <span>{nameValue || "Invalid option"}</span>
        <Button
          disabled={disabled}
          variant="destructive"
          className=""
          onClick={remove}
          size="sm"
          type="button"
        >
          <Trash size={20} />
        </Button>
      </CardHeader>
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
                Description <SupportsMarkdownTooltip />
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-10"
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
                    className={InputGroupSuffixClasses({ variant: "prefix" })}
                  >
                    $
                  </InputSuffix>
                  <InputGroupInput>
                    <Input
                      disabled={disabled}
                      placeholder="20"
                      type="number"
                      className={InputGroupInputClasses({ variant: "prefix" })}
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
          ids={fieldsIds}
          onSort={sortFields}
          onAdd={addNewField}
        >
          <div className="flex flex-grow flex-col gap-4">
            {fieldsFields.map((item, index) => {
              return (
                <FieldSelectCard
                  form={form}
                  item={item as WithId<any>}
                  key={(item as WithId<any>).id}
                  name={`${name}.fields.${index}`}
                  disabled={disabled}
                  remove={() => removeField(index)}
                  update={(newValue) => updateField(index, newValue)}
                />
              );
            })}
          </div>
        </Sortable>
        <Sortable
          title="Addons"
          ids={addonsIds}
          onSort={sortAddons}
          onAdd={addNewAddon}
        >
          <div className="flex flex-grow flex-col gap-4">
            {addonsFields.map((item, index) => {
              return (
                <AddonSelectCard
                  form={form}
                  item={item as WithId<any>}
                  key={(item as WithId<any>).id}
                  name={`${name}.addons.${index}`}
                  disabled={disabled}
                  remove={() => removeAddon(index)}
                  update={(newValue) => updateAddon(index, newValue)}
                />
              );
            })}
          </div>
        </Sortable>
      </CardContent>
    </Card>
  );
};
