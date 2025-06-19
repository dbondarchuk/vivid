import { Appointment, AppointmentFields } from "@vivid/types";
import { v4 } from "uuid";

const proxyHandler = {
  get: function (target: Record<string, any>, name: string) {
    return target.hasOwnProperty(name) ? target[name] : name;
  },
  has: function (target: Record<string, any>, name: string) {
    return true;
  },
};

const appointmentId = "hjsjrlklfsdnx";
export const demoAppointment: Appointment = {
  _id: appointmentId,
  createdAt: new Date(2024, 10, 20, 9, 0, 0),
  dateTime: new Date(2024, 10, 20, 9, 0, 0),
  status: "confirmed",
  timeZone: "America/New_York",
  note: "Demo note",
  totalPrice: 90,
  totalDuration: 150,
  endAt: new Date(2024, 10, 20, 11, 30, 0),
  option: {
    _id: "dfjkdlfj",
    name: "Demo option",
    description: "This is a demo option",
    duration: 100,
    price: 50,
    requireDeposit: "inherit",
  },
  files: [
    {
      _id: v4(),
      filename: "placeholder/400x200.png",
      mimeType: "image/png",
      size: 2300,
      uploadedAt: new Date(2024, 10, 20, 9, 0, 0),
      appointmentId,
      description: "Image 1",
    },
    {
      _id: v4(),
      filename: "placeholder/400x200.png",
      mimeType: "image/png",
      size: 2300,
      uploadedAt: new Date(2024, 10, 20, 9, 0, 0),
      appointmentId,
      description: "Image 2",
    },
    {
      _id: v4(),
      filename: "file1.mp4",
      mimeType: "video/mp4",
      size: 2300,
      uploadedAt: new Date(2024, 10, 20, 9, 0, 0),
      appointmentId,
      description: "Video 1",
    },
    {
      _id: v4(),
      filename: "file2.mp4",
      mimeType: "video/mp4",
      size: 2300,
      uploadedAt: new Date(2024, 10, 20, 9, 0, 0),
      appointmentId,
      description: "Video 2",
    },
  ],
  addons: [
    {
      _id: "addon1",
      name: "Addon #1",
      description: "This is first addon",
      duration: 20,
      price: 20,
    },
    {
      _id: "addon2",
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
      phone: "+1 (555)555-5555",
    },
    proxyHandler
  ) as AppointmentFields,
  fieldsLabels: new Proxy({}, proxyHandler),
  customerId: "customer-1234",
  customer: {
    _id: "customer-1234",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555)555-5555",
    knownEmails: [],
    knownNames: [],
    knownPhones: [],
    requireDeposit: "inherit",
  },
  discount: {
    id: "12345",
    code: "DEMOPROMO",
    discountAmount: 5.5,
    name: "Demo Discount",
  },
};
