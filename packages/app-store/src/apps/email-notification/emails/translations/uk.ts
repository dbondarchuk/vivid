import { EmailTemplates } from "../types";

const getText = (customText: string) => `
Привіт {{config.name}},

${customText}

Клієнт: [{{ customer.name }}]({{ config.url }}/admin/dashboard/customers/{{customerId}})

Ім'я: {{ fields.name }}

Email: {{ fields.email }}

Телефон: {{ fields.phone }}

{{#restFields}}

{{label}} ({{name}}): {{ value }}

{{/restFields}} {{#images}}

![{{description}}]({{ config.url }}/assets/{{filename}})

{{filename}}

{{/images}} {{#files}}

Файл: [{{filename}}]({{ config.url }}/assets/{{filename}})

{{/files}}

Обрана опція: {{ option.name }}

Обрані додатки:

{{#addons}}
1. {{name}}
{{/addons}}
{{^addons}}
- Жодного
{{/addons}}

Час: {{ dateTime }}

Тривалість: {{#duration.hours}}{{.}} год {{/duration.hours}}{{#duration.minutes}}{{.}} хв{{/duration.minutes}}

{{#discount}}

Промокод: {{code}} (-\${{discountAmountFormatted}}) ([{{name}}]({{ config.url }}/admin/dashboard/services/discounts/{{id}}))

{{/discount}} {{#totalPriceFormatted}}

Ціна: \${{.}}

{{/totalPriceFormatted}} 

{{#payments}}
Сплачено: \${{amountFormatted}} через {{appName}} {{paidAt}}
{{/payments}}
`;

export const UkEmailTemplates: EmailTemplates = {
  confirmed: {
    title: "Запис на {{option.name}} був підтверджений.",
    text: getText("Запис був підтверджений вами."),
  },
  declined: {
    title: "Запис на {{option.name}} був відхилений.",
    text: getText("Запис був відхилений вами."),
  },
  rescheduled: {
    title: "Запис був перенесений на {{dateTime}}",
    text: getText(
      "Запис на {{option.name}} від {{fields.name}} був перенесений на {{dateTime}}, тривалість {{#duration.hours}}{{.}} год {{/duration.hours}}{{#duration.minutes}}{{.}} хв{{/duration.minutes}}"
    ),
  },
  "auto-confirmed": {
    title: "Запис на {{option.name}} був запитаний і автоматично підтверджений",
    text: getText(
      "Новий запис був запитаний на веб-сайті і автоматично підтверджений."
    ),
  },
  pending: {
    title: "Запит на запис для {{option.name}}",
    text: getText(
      "Новий запис був запитаний на веб-сайті для {{option.name}}."
    ),
  },
  subject: "Запис на {{option.name}} від {{fields.name}} на {{dateTime}}",
  eventTitle: "{{fields.name}} на {{option.name}}",
  buttonTexts: {
    viewAppointment: "Переглянути запис",
    decline: "Відхилити",
    confirm: "Підтвердити",
  },
};
