import { AppointmentEntity } from "../booking";
import { Customer } from "../customers";

export type AssetEntity = {
  _id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  description?: string;
  appointmentId?: string;
  customerId?: string;
};

export type Asset = AssetEntity & {
  appointment?: AppointmentEntity & {
    customer?: Customer;
  };
  customer?: Customer;
};

export type AssetUpdate = Omit<
  AssetEntity,
  "_id" | "filename" | "mimeType" | "uploadedAt" | "size"
>;

export type UploadedFile = Asset & {
  url: string;
};
