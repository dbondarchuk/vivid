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
import { SquareArrowOutUpRight } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="sm:max-w-[80%]">
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
        <ScrollArea className="max-h-[80vh]">
          <AppointmentView appointment={appointment} />
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <div className="flex flex-row gap-2">
            {appointment.status !== "declined" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary">Decline</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        decline this appointment and will notify the customer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <AppointmentActionButton
                          variant="secondary"
                          _id={appointment._id}
                          status="declined"
                          onSuccess={updateAppointmentStatus}
                        >
                          Decline
                        </AppointmentActionButton>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {appointment.status === "pending" && (
                  <AppointmentActionButton
                    variant="default"
                    _id={appointment._id}
                    status="confirmed"
                    onSuccess={updateAppointmentStatus}
                  >
                    Confirm
                  </AppointmentActionButton>
                )}
              </>
            )}
          </div>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};