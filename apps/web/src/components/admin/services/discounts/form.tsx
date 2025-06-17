"use client";

import { OptionSelector } from "@/app/admin/dashboard/settings/appointments/tabs/cards/option-selector";
import { DiscountTypeLabels } from "@/constants/labels";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DatabaseId,
  DiscountUpdateModel,
  getDiscountSchemaWithUniqueCheck,
} from "@vivid/types";
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
  BooleanSelect,
  Button,
  cn,
  Combobox,
  DateTimeInput,
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
  Label,
  NonSortable,
  SaveButton,
  toastPromise,
} from "@vivid/ui";
import { is12hourUserTimeFormat } from "@vivid/utils";
import { PlusCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { AddonSelector } from "../options/addon-selector";
import { checkUniqueNameAndCode, create, update } from "./actions";

const DiscountLimitCard: React.FC<{
  disabled?: boolean;
  index: number;
  form: UseFormReturn<DiscountUpdateModel>;
  limit: NonNullable<DiscountUpdateModel["limitTo"]>[number];
  remove: () => void;
}> = ({ limit, form, index, disabled, remove }) => {
  const options = useFieldArray({
    control: form.control,
    name: `limitTo.${index}.options`,
  });

  const addons = useFieldArray({
    control: form.control,
    name: `limitTo.${index}.addons`,
  });

  return (
    <div className="flex flex-col gap-4 md:items-center md:grid md:grid-cols-[minmax(0,_1fr),50px,minmax(0,_1fr),50px] bg-card px-2 py-4 rounded">
      <div className="flex flex-col gap-4">
        <Label>Any of following options:</Label>
        {(options.fields || []).map((option, optionsIndex) => (
          <FormField
            key={optionsIndex}
            control={form.control}
            name={`limitTo.${index}.options.${optionsIndex}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputGroup>
                    <OptionSelector
                      className={cn(
                        InputGroupInputClasses(),
                        "[&>button]:rounded-r-none [&>button]:border-r-0  w-full flex-1"
                      )}
                      onItemSelect={(id) => {
                        field.onChange({ id });
                        field.onBlur();
                      }}
                      value={field.value.id}
                      disabled={disabled}
                    />
                    <InputSuffix>
                      <Button
                        variant="secondary"
                        size="icon"
                        className={cn(InputGroupSuffixClasses(), "px-2")}
                        onClick={() => options.remove(optionsIndex)}
                      >
                        <Trash />
                      </Button>
                    </InputSuffix>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {!options.fields?.length && <div>Any option</div>}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => options.append({ id: null as any })}
        >
          <PlusCircle /> Add new
        </Button>
      </div>
      <Label>And</Label>
      <div className="flex flex-col gap-4">
        <Label>Any of following addon bundles:</Label>
        {(addons.fields || []).map((addon, addonsIndex) => (
          <FormField
            key={addonsIndex}
            control={form.control}
            name={`limitTo.${index}.addons.${addonsIndex}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-row gap-2">
                    <AddonSelector
                      multi
                      // className={cn(
                      //   InputGroupInputClasses(),
                      //   "[&>button]:rounded-r-none [&>button]:border-r-0  w-full flex-1"
                      // )}
                      onItemSelect={(ids) => {
                        field.onChange({ ids: ids.map((id) => ({ id })) });
                        field.onBlur();
                      }}
                      value={field.value?.ids?.map((v) => v.id) ?? []}
                      disabled={disabled}
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => addons.remove(addonsIndex)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {!addons.fields?.length && <div>Any addon</div>}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => addons.append({ ids: [] })}
        >
          <PlusCircle /> Add new
        </Button>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={disabled}
            variant="destructive"
            className="[&>svg]:size-6"
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
              <p>Are you sure you want to remove this limit?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild variant="destructive">
              <Button onClick={remove}>Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DiscountTypeValues = Object.entries(DiscountTypeLabels).map(
  ([value, label]) => ({ value, label }) as IComboboxItem
);

export const DiscountForm: React.FC<{
  initialData?: DiscountUpdateModel & Partial<DatabaseId>;
}> = ({ initialData }) => {
  const use12HourFormat = React.useMemo(() => is12hourUserTimeFormat(), []);
  const formSchema = getDiscountSchemaWithUniqueCheck(
    (name, codes) =>
      checkUniqueNameAndCode(
        name,
        codes?.filter((code) => !!code) ?? [],
        initialData?._id
      ),
    "Discount name must be unique",
    "Promo code must be unique"
  );

  type FormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: initialData || {
      type: "percentage",
      enabled: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData?._id) {
          const { _id } = await create(data);
          router.push(`/admin/dashboard/services/discounts/${_id}`);
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

  const limitTo = useFieldArray({
    control: form.control,
    name: "limitTo",
  });

  const [discountType, codes] = form.watch(["type", "codes"]);

  const onAddCode = () => {
    if (codes.length >= 10) return;
    form.setValue("codes", [...(codes ?? []), ""]);
    form.trigger("codes");
  };

  const onCodeRemove = (index: number) => {
    const newValue = [...codes];
    newValue.splice(index, 1);
    form.setValue("codes", newValue);

    form.trigger("codes");
  };

  const codesState = form.getFieldState("codes");

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
                    Name <InfoTooltip>Unique name of the discount.</InfoTooltip>
                  </FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Discount name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <BooleanSelect
                      className="w-full"
                      trueLabel="Active"
                      falseLabel="Disabled"
                      value={field.value}
                      onValueChange={(item) => {
                        field.onChange(item);
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <InfoTooltip>Monetary type of discount</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      values={DiscountTypeValues}
                      searchLabel="Select discount type"
                      value={field.value}
                      onItemSelect={(item) => {
                        field.onChange(item);
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount value</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput>
                        {discountType === "amount" && (
                          <InputSuffix
                            className={InputGroupSuffixClasses({
                              variant: "prefix",
                            })}
                          >
                            $
                          </InputSuffix>
                        )}
                        <Input
                          disabled={loading}
                          placeholder="15"
                          type="number"
                          className={InputGroupInputClasses({
                            variant:
                              discountType === "percentage"
                                ? "suffix"
                                : "prefix",
                          })}
                          {...field}
                        />
                      </InputGroupInput>
                      {discountType === "percentage" && (
                        <InputSuffix
                          className={InputGroupSuffixClasses({
                            variant: "suffix",
                          })}
                        >
                          %
                        </InputSuffix>
                      )}
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Discount start date{" "}
                    <InfoTooltip>
                      <p>
                        The date when the discount becomes active. Only bookings
                        made on or after this date will be eligible for the
                        discount.
                      </p>
                      <p>Optional</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      disabled={loading}
                      clearable
                      format="MM/dd/yyyy hh:mm a"
                      use12HourFormat={use12HourFormat}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Discount end date{" "}
                    <InfoTooltip>
                      <p>
                        The last date the discount is valid.Bookings made after
                        this date will not be eligible for the discount.
                      </p>
                      <p>Optional</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      disabled={loading}
                      clearable
                      format="MM/dd/yyyy hh:mm a"
                      use12HourFormat={use12HourFormat}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Earliest eligible appointment date
                    <InfoTooltip>
                      <p>
                        The earliest appointment date (inclusive) for which this
                        discount can be applied. Appointments scheduled before
                        this date will not be eligible for the discount.
                      </p>
                      <p>Optional</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      disabled={loading}
                      clearable
                      format="MM/dd/yyyy hh:mm a"
                      use12HourFormat={use12HourFormat}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Latest eligible appointment date{" "}
                    <InfoTooltip>
                      <p>
                        The earliest appointment date (inclusive) for which this
                        discount can be applied. Appointments scheduled before
                        this date will not be eligible for the discount.
                      </p>
                      <p>Optional</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      disabled={loading}
                      clearable
                      format="MM/dd/yyyy hh:mm a"
                      use12HourFormat={use12HourFormat}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Maximum total uses{" "}
                    <InfoTooltip>
                      <p>
                        The total number of times this discount can be used
                        across all customers. Once this limit is reached, the
                        discount will no longer be available.
                      </p>
                      <p>Optional</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="3"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxUsagePerCustomer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Maximum uses per customer{" "}
                    <InfoTooltip>
                      <p>
                        The maximum number of times an individual customer can
                        use this discount. Further attempts to use the discount
                        by that customer will be rejected after this limit is
                        reached.
                      </p>
                      <p>Optional</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="3"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="codes"
            render={(codesField) => (
              <NonSortable
                title={
                  <span
                    className={cn(codesState.invalid && "text-destructive")}
                  >
                    Codes
                  </span>
                }
                ids={codes}
                onAdd={() => onAddCode()}
                disabled={loading}
                disabledAdd={codes.length >= 10}
              >
                <div className="flex flex-col px-2 py-2 gap-4">
                  {(codes || []).map((code, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`codes.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputGroup>
                              <Input
                                disabled={loading}
                                placeholder="SALE15"
                                className={cn(
                                  InputGroupInputClasses(),
                                  "flex-1"
                                )}
                                {...field}
                              />
                              <InputSuffix>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className={cn(
                                    InputGroupSuffixClasses(),
                                    "px-2"
                                  )}
                                  onClick={() => onCodeRemove(index)}
                                >
                                  <Trash />
                                </Button>
                              </InputSuffix>
                            </InputGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </div>
              </NonSortable>
            )}
          />

          <NonSortable
            title="Limit to"
            ids={limitTo.fields.map((f) => f.id)}
            onAdd={() => limitTo.append({})}
            disabled={loading}
          >
            <div className="flex flex-col gap-4">
              {limitTo.fields.map((limit, index) => (
                <DiscountLimitCard
                  key={index}
                  form={form}
                  index={index}
                  limit={limit}
                  disabled={loading}
                  remove={() => limitTo.remove(index)}
                />
              ))}
              {!limitTo.fields.length && (
                <div className="flex flex-col gap-4 px-2 py-4 border rounded bg-card">
                  Any option or addon
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                You can limit this discount to specific options and addons
              </div>
            </div>
          </NonSortable>
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
