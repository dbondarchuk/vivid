import { Appointment } from "@/types";
import { ConfigurationService } from "../configurationService";
import { CustomerEmailNotificationService } from "./email/customerEmailNotificationService";
import { OwnEmailNotificationService } from "./email/ownEmailNotificationService";
import { INotificationService } from "./notificaionService.interface";
import { CustomerTextMessageNotificationService } from "./textMessages/customerTextMessageNotificationService";
import { OwnerTextMessageNotificationService } from "./textMessages/ownerTextMessageNotificationService";

export class NotificationService implements INotificationService {
  private readonly services: INotificationService[] = [];
  constructor(protected readonly configurationService: ConfigurationService) {
    this.services = [
      new OwnEmailNotificationService(configurationService),
      new CustomerEmailNotificationService(configurationService),
      new CustomerTextMessageNotificationService(configurationService),
      new OwnerTextMessageNotificationService(configurationService),
    ];
  }

  async sendAppointmentRequestedNotification(
    appointment: Appointment
  ): Promise<void> {
    const promises = this.services.map((service) =>
      service.sendAppointmentRequestedNotification(appointment)
    );
    await Promise.all(promises);
  }

  async sendAppointmentDeclinedNotification(
    appointment: Appointment
  ): Promise<void> {
    const promises = this.services.map((service) =>
      service.sendAppointmentDeclinedNotification(appointment)
    );
    await Promise.all(promises);
  }

  async sendAppointmentConfirmedNotification(
    appointment: Appointment
  ): Promise<void> {
    const promises = this.services.map((service) =>
      service.sendAppointmentConfirmedNotification(appointment)
    );
    await Promise.all(promises);
  }

  async sendAppointmentRescheduledNotification(
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void> {
    const promises = this.services.map((service) =>
      service.sendAppointmentRescheduledNotification(
        appointment,
        newTime,
        newDuration
      )
    );
    await Promise.all(promises);
  }
}
