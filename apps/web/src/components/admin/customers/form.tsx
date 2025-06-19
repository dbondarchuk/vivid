"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomerUpdateModel,
  DatabaseId,
  getCustomerSchemaWithUniqueCheck,
  isPaymentRequiredForCustomerTypes,
} from "@vivid/types";
import {
  AssetSelectorDialog,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Combobox,
  DateTimeInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  Label,
  PhoneInput,
  SaveButton,
  Textarea,
  toastPromise,
} from "@vivid/ui";
import { PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkUniqueEmailAndPhone, create, update } from "./actions";

const IsPaymentRequiredForCustomerTypesLabels: Record<
  (typeof isPaymentRequiredForCustomerTypes)[number],
  string
> = {
  always: "Always",
  never: "Never",
  inherit: "Same as selected option or general configuration",
};

export const CustomerForm: React.FC<{
  initialData?: CustomerUpdateModel & Partial<DatabaseId>;
}> = ({ initialData }) => {
  const formSchema = getCustomerSchemaWithUniqueCheck(
    (emails, phones) =>
      checkUniqueEmailAndPhone(emails, phones, initialData?._id),
    "There is already a customer with one or more of the emails",
    "There is already a customer with one or more of the phones"
  );

  type FormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = React.useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = React.useState(false);

  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: initialData || {
      knownNames: [],
      knownEmails: [],
      knownPhones: [],
      requireDeposit: "inherit",
    },
  });

  const [knownNames, knownEmails, knownPhones] = form.watch([
    "knownNames",
    "knownEmails",
    "knownPhones",
  ]);

  const name = form.watch("name");

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (!initialData?._id) {
          const _id = await create(data);
          router.push(`/admin/dashboard/customers/${_id}`);
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

  const onAddPhone = () => {
    form.setValue("knownPhones", [...knownPhones, ""]);
  };

  const onAddEmail = () => {
    form.setValue("knownEmails", [...knownEmails, ""]);
  };

  const onAddName = () => {
    form.setValue("knownNames", [...knownNames, ""]);
  };

  const onPhoneRemove = (index: number) => {
    const newValue = [...knownPhones];
    newValue.splice(index, 1);
    form.setValue("knownPhones", newValue);

    form.trigger("knownPhones");
  };

  const onEmailRemove = (index: number) => {
    const newValue = [...knownEmails];
    newValue.splice(index, 1);
    form.setValue("knownEmails", newValue);

    form.trigger("knownEmails");
  };

  const onNameRemove = (index: number) => {
    const newValue = [...knownNames];
    newValue.splice(index, 1);
    form.setValue("knownNames", newValue);

    form.trigger("knownNames");
  };

  const requireDeposit = form.watch("requireDeposit");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 pb-4"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer photo</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <div className="flex flex-col gap-4 justify-between">
                      <div className="w-full relative justify-center flex flex-row">
                        <Image
                          src={field.value ?? "/unknown-person.png"}
                          alt="Customer photo"
                          height={200}
                          width={200}
                        />
                      </div>
                      {initialData?._id && (
                        <div className="w-full">
                          <AssetSelectorDialog
                            accept={["image/*"]}
                            isOpen={avatarDialogOpen}
                            addTo={{
                              customerId: initialData._id,
                              description: `${name} - Customer Photo`,
                            }}
                            close={() => setAvatarDialogOpen(false)}
                            onSelected={(asset) =>
                              field.onChange(`/assets/${asset.filename}`)
                            }
                          />
                          <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => setAvatarDialogOpen(true)}
                          >
                            Change photo
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>

                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input
                          type="email"
                          disabled={loading}
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>

                      <FormControl>
                        <PhoneInput
                          label="Phone"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>

                      <FormControl>
                        <DateTimeInput
                          disabled={loading}
                          clearable
                          format="MM/dd/yyyy"
                          hideTime
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dontAllowBookings"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row items-center gap-2">
                        <Checkbox
                          id="dontAllowBookings"
                          disabled={loading}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormLabel
                          htmlFor="dontAllowBookings"
                          className="cursor-pointer"
                        >
                          Do not allow appointments{" "}
                          <InfoTooltip>
                            If checked, customer will not be able to make
                            appointments. Appointment can only be done by you
                          </InfoTooltip>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requireDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Require deposit{" "}
                        <InfoTooltip>
                          <p>Should this customer be required to pay deposit</p>
                          <p className="font-semibold">
                            Requires configured payments app
                          </p>
                        </InfoTooltip>
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          disabled={loading}
                          className="flex w-full font-normal text-base"
                          values={isPaymentRequiredForCustomerTypes.map(
                            (value) => ({
                              value,
                              label:
                                IsPaymentRequiredForCustomerTypesLabels[value],
                            })
                          )}
                          searchLabel="Select option"
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
                {requireDeposit === "always" && (
                  <>
                    <FormField
                      control={form.control}
                      name="depositPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Deposit amount{" "}
                            <InfoTooltip>
                              <p>Deposit amount in percents</p>
                              <p>
                                If set to 100, full price will be required to be
                                paid upfront
                              </p>
                            </InfoTooltip>
                          </FormLabel>
                          <FormControl>
                            <InputGroup>
                              <InputGroupInput>
                                <Input
                                  disabled={loading}
                                  placeholder="20"
                                  type="number"
                                  className={InputGroupInputClasses()}
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    form.trigger("requireDeposit");
                                  }}
                                />
                              </InputGroupInput>
                              <InputSuffix
                                className={InputGroupSuffixClasses()}
                              >
                                %
                              </InputSuffix>
                            </InputGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional information</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                <div className="flex flex-col gap-4">
                  <Label>
                    Alternative names{" "}
                    <InfoTooltip>
                      Alternative names are provided by customers during the
                      appointment request
                    </InfoTooltip>
                  </Label>
                  {(knownNames || []).map((name, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`knownNames.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputGroup>
                              <Input
                                disabled={loading}
                                placeholder="John Doe"
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
                                  onClick={() => onNameRemove(index)}
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
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onAddName}
                  >
                    <PlusCircle /> Add new
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  <Label>
                    Alternative emails
                    <InfoTooltip>
                      Alternative emails help to match appointments by
                      alternative emails that customer may use
                    </InfoTooltip>
                  </Label>
                  {(knownEmails || []).map((email, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`knownEmails.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputGroup>
                              <Input
                                type="email"
                                disabled={loading}
                                placeholder="john.doe@example.com"
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
                                  onClick={() => onEmailRemove(index)}
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
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onAddEmail}
                  >
                    <PlusCircle /> Add new
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  <Label>
                    Alternative phones{" "}
                    <InfoTooltip>
                      Alternative phones help to match appointments by
                      alternative phone numbers that customer may use
                    </InfoTooltip>
                  </Label>
                  {(knownPhones || []).map((phone, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`knownPhones.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputGroup>
                              <PhoneInput
                                label="Phone"
                                disabled={loading}
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
                                  onClick={() => onPhoneRemove(index)}
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
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onAddPhone}
                  >
                    <PlusCircle /> Add new
                  </Button>
                </div>
              </div>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>

                    <FormControl>
                      <Textarea
                        autoResize
                        disabled={loading}
                        placeholder="Customer notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <SaveButton form={form} />
      </form>
    </Form>
  );
};
