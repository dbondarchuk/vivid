import { Appointment } from "@/types";
import { ConfigurationService } from "../configurationService";
import { CustomerEmailNotificationService } from "./customerEmailNotificationService";
import { INotificationService } from "./notificaionService.interface";
import { OwnEmailNotificationService } from "./ownEmailNotificationService";

export class NotificationService implements INotificationService {
  private readonly services: INotificationService[] = [];
  constructor(protected readonly configurationService: ConfigurationService) {
    this.services = [
      new OwnEmailNotificationService(configurationService),
      new CustomerEmailNotificationService(configurationService),
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
}
