import {
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "@/components/admin/forms/inputGroupClasses";
import { SupportsMarkdownTooltip } from "@/components/admin/tooltip/supportsMarkdown";
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
import { Textarea } from "@/components/ui/textarea";
import { Copy, Trash } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AppointmentAddon, AppointmentOption } from "@/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};
