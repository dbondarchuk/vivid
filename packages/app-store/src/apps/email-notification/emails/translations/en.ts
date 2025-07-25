import { EmailTemplates } from "../types";

const getText = (customText: string) => `
Hi {{config.name}},

${customText}

Customer: [{{ customer.name }}]({{ config.url }}/admin/dashboard/customers/{{customerId}})

Name: {{ fields.name }}

Email: {{ fields.email }}

Phone: {{ fields.phone }}

{{#restFields}}

{{label}} ({{name}}): {{ value }}

{{/restFields}} {{#images}}

![{{description}}]({{ config.url }}/assets/{{filename}})

{{filename}}

{{/images}} {{#files}}

File: [{{filename}}]({{ config.url }}/assets/{{filename}})

{{/files}}

Option selected: {{ option.name }}

Addons selected:

{{#addons}}
1. {{name}}
{{/addons}}
{{^addons}}
- None
{{/addons}}

Time: {{ dateTime }}

Duration: {{#duration.hours}}{{.}} hr {{/duration.hours}}{{#duration.minutes}}{{.}} min{{/duration.minutes}}

{{#discount}}

Promo code: {{code}} (-\${{discountAmountFormatted}}) ([{{name}}]({{ config.url }}/admin/dashboard/services/discounts/{{id}}))

{{/discount}} {{#totalPriceFormatted}}

Price: \${{.}}

{{/totalPriceFormatted}} 

{{#payments}}
Amount paid: \${{amountFormatted}} via {{appName}} on {{paidAt}}
{{/payments}}
`;

export const EnEmailTemplates: EmailTemplates = {
  confirmed: {
    title: "Appointment for {{option.name}} was confirmed.",
    text: getText("The appointment was confirmed by you."),
  },
  declined: {
    title: "Appointment for {{option.name}} was declined.",
    text: getText("The appointment was declined by you."),
  },
  rescheduled: {
    title: "Appointment was rescheduled for {{dateTime}}",
    text: getText(
      "The appointment for {{option.name}} by {{fields.name}} was rescheduled for {{dateTime}}, duration {{#duration.hours}}{{.}} hr {{/duration.hours}}{{#duration.minutes}}{{.}} min{{/duration.minutes}}"
    ),
  },
  "auto-confirmed": {
    title: "Appointment for {{option.name}} was requested and auto-confirmed",
    text: getText(
      "A new appointment was requested on the website and was auto-confirmed."
    ),
  },
  pending: {
    title: "Appointment for {{option.name}} was requested",
    text: getText(
      "A new appointment was requested on the website for {{option.name}}."
    ),
  },
  subject: "Appointment for {{option.name}} by {{fields.name}} at {{dateTime}}",
  eventTitle: "{{fields.name}} for {{option.name}}",
  buttonTexts: {
    viewAppointment: "View Appointment",
    decline: "Decline",
    confirm: "Confirm",
  },
};
