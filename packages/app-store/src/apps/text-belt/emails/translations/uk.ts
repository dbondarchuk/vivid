import { EmailTemplates } from "../types";

const notifyReplyText = `
Привіт {{config.name}},

Була отримана відповідь на текстове повідомлення від {{reply.from}}.

Текст відповіді:

*{{ reply.message }}*

{{#customer}}
Клієнт: [{{ name }}]({{ config.url }}/admin/dashboard/customers/{{_id}})
{{/customer}}

{{#_id}}
Статус запису: {{ statusText }}

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

Час: {{ dateTime.full}}

Тривалість: {{#duration.hours}}{{.}} год {{/duration.hours}}{{#duration.minutes}}{{.}} хв{{/duration.minutes}}

{{#discount}}

Промокод: {{code}} (-\${{discountAmountFormatted}}) ([{{name}}]({{ config.url }}/admin/dashboard/services/discounts/{{id}}))

{{/discount}} {{#totalPriceFormatted}}

Ціна: \${{.}}

{{/totalPriceFormatted}} 

{{#payments}}
Сплачено: \${{amountFormatted}} через {{appName}} {{paidAt}}
{{/payments}}

{{/_id}}
`;

const notifyLowQuotaText = `
Привіт {{config.name}},

Ваш ліміт TextBelt майже вичерпаний. Будь ласка, поповніть кредити.

У вас залишилося {{quotaRemaining}} кредитів.
`;

export const UkEmailTemplates: EmailTemplates = {
  "user-notify-reply": {
    title: "Відповідь на текстове повідомлення",
    text: notifyReplyText,
    subject:
      "Відповідь на текстове повідомлення від {{#customer}}{{name}}{{/customer}}{{^customer}}{{reply.fromNumber}}{{/customer}}",
  },
  "user-notify-low-quota": {
    title: "Низький ліміт TextBelt",
    text: notifyLowQuotaText,
    subject: "Низький ліміт TextBelt",
  },
  buttonTexts: {
    viewAppointment: "Переглянути запис",
    viewCustomer: "Переглянути клієнта",
  },
};
