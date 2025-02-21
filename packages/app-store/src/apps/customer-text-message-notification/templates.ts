export const autoReply = `Hi{{#fields.name}} {{.}}{{/fields.name}},
This is an unmonitored phone number. Please send your reply to {{config.phone}}.

Thanks,
{{config.name}} `;

export const appointmentCreated = `Hi {{fields.name}},
Thank you for selecting {{config.name}}!
We will confirm your appointment on {{dateTime}} for {{ option.name }} shortly.

Please call us at {{config.phone}} if you have any questions!

Looking forward to seeing you!
{{config.name}}`;

export const appointmentConfirmed = `Hi {{fields.name}},
Thank you for selecting {{config.name}}!
We have confirmed your appointment on {{dateTime}} for {{ option.name }}.

Please call us at {{config.phone}} if you have any questions!

Looking forward to seeing you!
{{config.name}}`;

export const appointmentDeclined = `Hi {{fields.name}},
Your appointment for {{ option.name }} on {{dateTime}} was declined or canceled.

Please call us at {{config.phone}} if you have any questions!

Looking forward to seeing you!
{{config.name}}`;

export const appointmentRescheduled = `Hi {{fields.name}},
Your appointment for {{ option.name }} was rescheduled to {{dateTime}}.

Please call us at {{config.phone}} if you have any questions!

Looking forward to seeing you!
{{config.name}}`;
