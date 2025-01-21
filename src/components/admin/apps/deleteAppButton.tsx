"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Unplug } from "lucide-react";
import React from "react";
import { deleteApp } from "./app.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export type DeleteAppButtonProps = {
  appId: string;
};

export const DeleteAppButton: React.FC<DeleteAppButtonProps> = ({ appId }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const disconnectApp = async () => {
    setIsLoading(true);
    try {
      await deleteApp(appId);

      setIsDialogOpen(false);
      router.refresh();
      toast({
        variant: "default",
        title: "Disconnected",
        description: "App was succesfully disconnected",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Unplug /> Disconnect app
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will remove this app and may
            break services that are using it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isLoading}
            onClick={disconnectApp}
            className="flex flex-row gap-1 items-center"
          >
            {isLoading ? <Spinner /> : <Unplug />} <span>Disconnect</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
