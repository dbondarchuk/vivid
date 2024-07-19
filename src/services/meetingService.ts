import { MeetingOption } from "@/models/meetingOption";
import { ConfigurationService } from "./configurationService";

export class MeetingService {
  constructor(protected readonly configurationService: ConfigurationService) {}

  public async getOptions(): Promise<MeetingOption[]> {
    const configuration = await this.configurationService.getConfiguration();
    const { meetingOptions } = configuration.booking;

    return configuration.booking.meetingOptions;
  }

  public async getOption(slug: string): Promise<MeetingOption | undefined> {
    const configuration = await this.configurationService.getConfiguration();
    const { meetingOptions } = configuration.booking;

    return meetingOptions.find((option) => option.slug === slug);
  }
}
