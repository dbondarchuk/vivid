import { useI18n } from "@vivid/i18n";
import {
  AppSelector,
  BooleanSelect,
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
} from "@vivid/ui";
import { TabProps } from "./types";

export const PaymentsTab: React.FC<TabProps> = ({ form, disabled }) => {
  const t = useI18n("admin");
  const enablePayments = form.watch("payments.enable");
  const requireDeposit = form.watch("payments.requireDeposit");
  return (
    <div className="gap-2 grid grid-cols-1 md:grid-cols-2 md:gap-4 w-full">
      {/* <div className="flex flex-col gap-2"> */}
      <FormField
        control={form.control}
        name="payments.enable"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.payments.enableDeposits")}{" "}
              <InfoTooltip>
                {t("settings.appointments.form.payments.enableDepositsTooltip")}
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <BooleanSelect
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  if (val) {
                    form.setValue("payments.paymentAppId", "" as any);
                  }
                  field.onBlur();
                  form.trigger("payments.paymentAppId");
                }}
                className="w-full"
                trueLabel={t("settings.appointments.form.payments.enable")}
                falseLabel={t("settings.appointments.form.payments.disable")}
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
                  {t("settings.appointments.form.payments.paymentsApp")}{" "}
                  <InfoTooltip>
                    {t(
                      "settings.appointments.form.payments.paymentsAppTooltip"
                    )}
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
                      form.trigger("payments.enable");
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
                  {t("settings.appointments.form.payments.requireDeposit")}{" "}
                  <InfoTooltip>
                    <p>
                      {t(
                        "settings.appointments.form.payments.requireDepositTooltip1"
                      )}
                    </p>
                    <p>
                      {t(
                        "settings.appointments.form.payments.requireDepositTooltip2"
                      )}
                    </p>
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel={t("settings.appointments.form.payments.require")}
                    falseLabel={t(
                      "settings.appointments.form.payments.doNotRequire"
                    )}
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
                      {t("settings.appointments.form.payments.depositAmount")}{" "}
                      <InfoTooltip>
                        <p>
                          {t(
                            "settings.appointments.form.payments.depositAmountTooltip1"
                          )}
                        </p>
                        <p>
                          {t(
                            "settings.appointments.form.payments.depositAmountTooltip2"
                          )}
                        </p>
                        <p>
                          {t(
                            "settings.appointments.form.payments.depositAmountTooltip3"
                          )}
                        </p>
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
              <FormField
                control={form.control}
                name="payments.dontRequireIfCompletedMinNumberOfAppointments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Min amount of appointments to not require deposit{" "}
                      <InfoTooltip>
                        <p>
                          Do not require deposit for customers who have at least
                          specified amount of appointments completed
                        </p>
                        <p>
                          <strong>Example:</strong> If set to 3, customers who
                          are booking their first, second, or third appointment
                          will be required to pay a deposit.
                        </p>
                        <p>
                          While customers who are making their 4th or later
                          appointmens will not be required to pay deposit unless
                          it is specifically required for the customer
                        </p>
                        <p>
                          <strong>Optional</strong>
                        </p>
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput>
                          <Input
                            disabled={disabled}
                            placeholder="3"
                            type="number"
                            className={InputGroupInputClasses()}
                            {...field}
                          />
                        </InputGroupInput>
                        <InputSuffix className={InputGroupSuffixClasses()}>
                          appointments
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
