import {
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "@/components/admin/forms/inputGroupClasses";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputSuffix,
} from "@/components/ui/inputGroup";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const addonSchema = z.object({
  name: z.string().min(2, "Addon name must me at least 2 characters long"),
  id: z.string(),
  description: z
    .string()
    .min(2, "Addon description must be at least 2 characters long"),
  duration: z.coerce
    .number()
    .min(0, "Addon duration must be at least 0 minutes")
    .optional(),
  price: z.coerce.number().min(0, "Addon price must be at least 0").optional(),
});

export type AddonSchema = z.infer<typeof addonSchema>;

export type AddonProps = {
  item: AddonSchema;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: AddonSchema) => void;
};

export type AddonType = "Addon";

export interface AddonDragData {
  type: AddonType;
  item: AddonSchema;
}

export const AddonCard: React.FC<AddonProps> = ({
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
      type: "Addon",
      item,
    } satisfies AddonDragData,
    attributes: {
      roleDescription: "Addon",
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
          <span className="sr-only">Move appointment addon</span>
          <GripVertical />
        </Button>
        <span>{nameValue || "Invalid addon"}</span>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
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
      </CardContent>
    </Card>
  );
};
