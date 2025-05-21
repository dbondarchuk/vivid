import { DialogProps } from "@radix-ui/react-dialog";
import { Appointment, AppointmentStatus } from "@vivid/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Link,
} from "@vivid/ui";
import { SquareArrowOutUpRight } from "lucide-react";
import React from "react";
import { AppointmentView } from "./appoitment-view";

export type AppointmentDialogProps = DialogProps & {
  appointment: Appointment;
  timeZone?: string;
};

export const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  appointment,
  timeZone,
  ...rest
}) => {
  return (
    <Dialog {...rest}>
      <DialogContent className="sm:max-w-[80%] flex flex-col max-h-[100%]">
        <DialogHeader>
          <DialogTitle className="w-full flex flex-row justify-between items-center mt-2">
            <span>{appointment.option.name}</span>
            <Link
              variant="ghost"
              title="View full appointment information"
              href={`/admin/dashboard/appointments/${appointment._id}`}
            >
              <SquareArrowOutUpRight size={20} />
            </Link>
          </DialogTitle>
          <DialogDescription>By {appointment.fields.name}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full overflow-auto">
          <AppointmentView appointment={appointment} timeZone={timeZone} />
        </div>
        <DialogFooter className="flex-row gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
