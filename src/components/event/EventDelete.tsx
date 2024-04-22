import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "react-query";
import EventService from "@/services/eventService";
import { toast } from "react-toastify";

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

export default function EventDelete({
  DeleteEventId,
}: {
  DeleteEventId?: string | null;
}) {
  const queryClient = useQueryClient();
  const eventService = new EventService();
  const [id, setId] = useState("");

  useEffect(() => {
    if (DeleteEventId != undefined) {
      setId(DeleteEventId);
    }
  }, [DeleteEventId]);

  const { mutate: deleteEvent } = useMutation(
    (id: string) => eventService.deleteEvent(id),
    {
      onSuccess: async (data) => {
        console.log(data);
      },
      onSettled: async () => {},
    }
  );

  function handleDeleteEvent(id: string) {
    deleteEvent(id, {
      onError: (err: any) => {
        toast.error(err?.message ? err?.message : "Error deleting event");
      },
      onSuccess: async () => {
        toast.success("Event deleted successfully");
        await queryClient.invalidateQueries(["getAllEvents"]);
      },
    });
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteEvent(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
