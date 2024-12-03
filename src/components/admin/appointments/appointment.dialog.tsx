import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/components/ui/link";
import { Appointment, AppointmentStatus } from "@/types";
import { DialogProps } from "@radix-ui/react-dialog";
import {
  CalendarCheck2,
  CalendarX2,
  SquareArrowOutUpRight,
} from "lucide-react";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppointmentActionButton } from "./action.button";
import { AppointmentView } from "./appoitment.view";

export type AppointmentDialogProps = DialogProps & {
  appointment: Appointment;
};

export const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  appointment: propAppointment,
  ...rest
}) => {
  const [appointment, setAppointment] = React.useState(propAppointment);
  const updateAppointmentStatus = (newStatus: AppointmentStatus) => {
    setAppointment({
      ...appointment,
      status: newStatus,
    });
  };

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
          <AppointmentView appointment={appointment} />
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
