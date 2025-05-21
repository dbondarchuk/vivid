import {
  AppointmentAddon,
  AppointmentAddonUpdateModel,
  AppointmentOption,
  AppointmentOptionUpdateModel,
  FieldType,
} from "../booking";
import { ServiceField, ServiceFieldUpdateModel } from "../configuration";
import { Query, WithTotal } from "../database";

export type IdName = {
  _id: string;
  name: string;
};

export type FieldsType<T extends boolean | undefined> = T extends true
  ? ServiceField & {
      addons: IdName[];
      options: IdName[];
    }
  : ServiceField;

export type AddonsType<T extends boolean | undefined> = T extends true
  ? AppointmentAddon & {
      options: IdName[];
    }
  : AppointmentAddon;

export interface IServicesService {
  /** Fields */
  getField(id: string): Promise<ServiceField | null>;
  getFields<T extends boolean | undefined = undefined>(
    query: Query & {
      type?: FieldType[];
    },
    includeUsage?: T
  ): Promise<WithTotal<FieldsType<T>>>;
  getFieldsById(ids: string[]): Promise<ServiceField[]>;
  createField(field: ServiceFieldUpdateModel): Promise<ServiceField>;
  updateField(id: string, update: ServiceFieldUpdateModel): Promise<void>;
  deleteField(id: string): Promise<ServiceField | null>;
  deleteFields(ids: string[]): Promise<void>;
  checkFieldUniqueName(name: string, id?: string): Promise<boolean>;

  /** Addons */
  getAddon(id: string): Promise<AppointmentAddon | null>;
  getAddons<T extends boolean | undefined = undefined>(
    query: Query,
    includeUsage?: T
  ): Promise<WithTotal<AddonsType<T>>>;
  getAddonsById(ids: string[]): Promise<AppointmentAddon[]>;
  createAddon(addon: AppointmentAddonUpdateModel): Promise<AppointmentAddon>;
  updateAddon(id: string, update: AppointmentAddonUpdateModel): Promise<void>;
  deleteAddon(id: string): Promise<AppointmentAddon | null>;
  deleteAddons(ids: string[]): Promise<void>;
  checkAddonUniqueName(name: string, id?: string): Promise<boolean>;

  /** Options */
  getOption(id: string): Promise<AppointmentOption | null>;
  getOptions(query: Query): Promise<WithTotal<AppointmentOption>>;
  createOption(addon: AppointmentOptionUpdateModel): Promise<AppointmentOption>;
  updateOption(id: string, update: AppointmentOptionUpdateModel): Promise<void>;
  deleteOption(id: string): Promise<AppointmentOption | null>;
  deleteOptions(ids: string[]): Promise<void>;
  checkOptionUniqueName(name: string, id?: string): Promise<boolean>;
}
