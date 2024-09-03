import type { AppointmentOption } from "@/types";
import { ConfigurationService } from "./configurationService";

export class MeetingService {
  constructor(protected readonly configurationService: ConfigurationService) {}

  public async getOptions(): Promise<AppointmentOption[]> {
    const { options: meetingOptions } =
      await this.configurationService.getConfiguration("booking");

    return meetingOptions;
  }

  public async getOption(slug: string): Promise<AppointmentOption | undefined> {
    const { options: meetingOptions } =
      await this.configurationService.getConfiguration("booking");

    return meetingOptions.find((option) => option.id === slug);
  }
}
