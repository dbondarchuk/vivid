import { AddonsCard } from "./addons-card";
import { CalendarCard } from "./calendar-card";
import { ConfirmationCard } from "./confirmation-card";
import { Step, StepType } from "./context";
import { DurationCard } from "./duration-card";
import { FormCard } from "./form-card";
import { PaymentCard } from "./payment-card";

export const ScheduleSteps: Record<StepType, Step> = {
  duration: {
    prev: {
      show: ({ goBack }) => !!goBack,
      isEnabled: () => true,
      action: ({ goBack }) => goBack?.(),
    },
    next: {
      show: () => true,
      isEnabled: ({ duration: optionDuration }) => !!optionDuration,
      action: ({ setStep, appointmentOption }) => {
        setStep(appointmentOption.addons?.length ? "addons" : "calendar");
      },
    },
    Content: DurationCard,
  },
  addons: {
    prev: {
      show: () => true,
      isEnabled: () => true,
      action: ({ appointmentOption, goBack, setStep }) => {
        if (appointmentOption.duration && !!goBack) {
          goBack();
        } else {
          setStep("duration");
        }
      },
    },
    next: {
      show: () => true,
      isEnabled: () => true,
      action: ({ fetchAvailability, setStep }) => {
        fetchAvailability();
        setStep("calendar");
      },
    },
    Content: AddonsCard,
  },
  calendar: {
    prev: {
      show: () => true,
      isEnabled: () => true,
      action: ({ appointmentOption, goBack, setStep }) => {
        if (appointmentOption.addons?.length) {
          setStep("addons");
          return;
        }

        if (appointmentOption.duration && goBack) {
          goBack();
          return;
        }

        setStep("duration");
      },
    },
    next: {
      show: () => true,
      isEnabled: ({ dateTime }) => !!dateTime,
      action: ({ setStep }) => setStep("form"),
    },
    Content: CalendarCard,
  },
  form: {
    prev: {
      show: () => true,
      isEnabled: () => true,
      action: ({ setStep }) => setStep("calendar"),
    },
    next: {
      show: () => true,
      isEnabled: ({ isFormValid }) => isFormValid,
      action: async (ctx) => {
        try {
          const payment = await ctx.fetchPaymentInformation();
          ctx.setPaymentInformation(payment);

          if (!payment || payment.intent?.status === "paid") {
            ctx.onSubmit();
          } else {
            ctx.setStep("payment");
          }
        } catch (e) {
          console.error(e);
        }
      },
    },
    Content: FormCard,
  },
  payment: {
    prev: {
      show: () => true,
      isEnabled: () => true,
      action: ({ setStep }) => setStep("form"),
    },
    next: {
      show: () => false,
      isEnabled: () => false,
      action: () => {},
    },
    Content: PaymentCard,
  },
  confirmation: {
    prev: {
      show: () => false,
      isEnabled: () => false,
      action: () => {},
    },
    next: {
      show: () => false,
      isEnabled: () => false,
      action: () => {},
    },
    Content: ConfirmationCard,
  },
};
