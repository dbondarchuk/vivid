import { Appointment, AppointmentFields } from "@vivid/types";

const proxyHandler = {
  get: function (target: Record<string, any>, name: string) {
    return target.hasOwnProperty(name) ? target[name] : name;
  },
  has: function (target: Record<string, any>, name: string) {
    return true;
  },
};

export const demoAppointment: Appointment = {
  _id: "hjsjrlklfsdnx",
  createdAt: new Date(2024, 10, 20, 9, 0, 0),
  dateTime: new Date(2024, 10, 20, 9, 0, 0),
  status: "confirmed",
  timeZone: "America/New_York",
  note: "Demo note",
  totalPrice: 90,
  totalDuration: 150,
  option: {
    id: "dfjkdlfj",
    name: "Demo option",
    description: "This is a demo option",
    duration: 100,
    price: 50,
    fields: {},
  },
  addons: [
    {
      id: "addon1",
      name: "Addon #1",
      description: "This is first addon",
      duration: 20,
      price: 20,
    },
    {
      id: "addon2",
      name: "Addon #2",
      description: "This is second addon",
      duration: 30,
      price: 20,
    },
  ],
  fields: new Proxy(
    {
      name: "John Smith",
      email: "john.smith@example.com",
    },
    proxyHandler
  ) as AppointmentFields,
};
