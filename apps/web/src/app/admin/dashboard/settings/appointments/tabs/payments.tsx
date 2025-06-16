import {
  AppSelector,
  BooleanSelect,
  FormControl,
  FormDescription,
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
} from "@vivid/ui";
import { TabProps } from "./types";
import { OptionSelector } from "./cards/option-selector";

export const PaymentsTab: React.FC<TabProps> = ({ form, disabled }) => {
  const enablePayments = form.watch("payments.enable");
  const requireDeposit = form.watch("payments.requireDeposit");
  return (
    <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4 w-full">
      {/* <div className="flex flex-col gap-2"> */}
      <FormField
        control={form.control}
        name="payments.enable"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Enable Deposits{" "}
              <InfoTooltip>
                Enables ability to ask for a deposit to book an appointment
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <BooleanSelect
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
                trueLabel="Enable"
                falseLabel="Disable"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {enablePayments && (
        <>
          <FormField
            control={form.control}
            name="payments.paymentAppId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Require deposit{" "}
                  <InfoTooltip>
                    If enabled, each customer will be required to pay a deposit
                    to book an appointment
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <AppSelector
                    scope="payment"
                    className="w-full"
                    disabled={disabled}
                    value={field.value}
                    onItemSelect={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4 w-full"> */}
          <FormField
            control={form.control}
            name="payments.requireDeposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Require deposit{" "}
                  <InfoTooltip>
                    <p>
                      If enabled, each customer will be required to pay a
                      deposit to book an appointment
                    </p>
                    <p>Can be overriden per each customer</p>
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel="Require"
                    falseLabel="Do not require"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {requireDeposit && (
            <>
              <FormField
                control={form.control}
                name="payments.depositPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Deposit amount{" "}
                      <InfoTooltip>
                        <p>Deposit amount in percents</p>
                        <p>
                          If set to 100, full price will be required to be paid
                          upfront
                        </p>
                        <p>Can be overriden per each option or customer</p>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput>
                          <Input
                            disabled={disabled}
                            placeholder="20"
                            type="number"
                            className={InputGroupInputClasses()}
                            {...field}
                          />
                        </InputGroupInput>
                        <InputSuffix className={InputGroupSuffixClasses()}>
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
          {/* </div> */}
        </>
      )}
    </div>
  );
};
