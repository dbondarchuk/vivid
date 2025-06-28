import { TextMessageResenderMessage } from "../types";

export const UkTextMessageResenderMessages: TextMessageResenderMessage = {
  resendToUserFromCustomer: `Привіт {{config.name}}, {{customer.name}} відповів з {{reply.from}}:
{{reply.message}}
Ви можете відповісти на це повідомлення безпосередньо`,
  resendToUserFromUnknown: `Привіт {{config.name}}, У вас є текстове повідомлення від {{reply.from}}:
{{reply.message}}
Ви можете відповісти на це повідомлення безпосередньо`,
};
