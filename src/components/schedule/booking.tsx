import { ConfigurationService } from "@/services/configurationService";
import { MeetingService } from "@/services/meetingService";
import { Meetings } from "./meetings";

export type BookingProps = {
  className?: string;
};

export const Booking: React.FC<BookingProps> = async ({ className }) => {
  const configurationService = new ConfigurationService();
  const meetingService = new MeetingService(configurationService);

  const meetings = await meetingService.getOptions();

  return <Meetings meetings={meetings} meetingsClassName={className} />;
};
