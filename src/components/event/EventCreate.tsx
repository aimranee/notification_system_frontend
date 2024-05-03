import React, {
  FormEvent,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "react-query";
import EventService from "@/services/eventService";
import { toast } from "react-toastify";
import { Checkbox } from "../ui/checkbox";

export default function EventCreate({
  IsEdit = false,
  EditEventDetails,
}: {
  IsEdit?: boolean;
  EditEventDetails?: UpdateEvent | null;
}) {
  const queryClient = useQueryClient();
  const eventService = new EventService();
  const [nameError, setNameError] = useState("");
  const [variableError, setVariableError] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [editable, setEditable] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (IsEdit && EditEventDetails != undefined) {
      setName(EditEventDetails?.name);
      setEditable(EditEventDetails?.editable);
      setIsChecked(EditEventDetails?.editable);
      setId(EditEventDetails?.id);
    }
  }, [IsEdit]);

  const clearForm = () => {
    setName("");
    setEditable(false);
    setNameError("");
    setVariableError("");
    setIsChecked(false);
  };

  function isValidName(name: string) {
    let regexp = new RegExp("^[A-Z_]+$");
    return regexp.test(name);
  }

  function handleCreateEvent(e: FormEvent<HTMLButtonElement>) {
    if (!isValidName(name)) {
      setNameError(
        "Please enter a valid app name. Use letters, numbers, underscores or hyphens"
      );
      e.preventDefault();
      return;
    }
    e.preventDefault();

    let event = {
      name,
      editable,
    };
    createEvent(event, {
      onError: (err: any) => {
        toast.error(err?.message ? err?.message : "Error creating event");
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(["getAllEvents"]);
        toast.success("Event created successfully");
        clearForm();
      },
    });
  }

  function handleEditEvent(e: FormEvent<HTMLButtonElement>) {
    if (!isValidName(name)) {
      setNameError(
        "Please enter a valid app name. Use letters, numbers, underscores or hyphens"
      );
      e.preventDefault();
      return;
    }
    e.preventDefault();
    editEvent(
      {
        id,
        name,
        editable,
      },
      {
        onError: (err: any) => {
          toast.error(err?.message ? err?.message : "Error editing event");
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries(["getAllEvents"]);
          toast.success("Event updated successfully");
          clearForm();
        },
      }
    );
  }

  const { mutate: editEvent } = useMutation(
    (data: UpdateEvent) => eventService.editEvent(data),
    {
      onSuccess: async (data) => {
        // console.log(data);
      },
      onSettled: async () => {},
    }
  );

  const { mutate: createEvent } = useMutation(
    (data: CreateEvent) => eventService.createEvent(data),
    {
      onSuccess: async (data) => {
        // console.log(data);
      },
      onSettled: async () => {},
    }
  );

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {IsEdit ? (
            <Button variant="ghost" className="h-8 w-8 p-0">
              Edit
            </Button>
          ) : (
            <Button className="mt-4">Create Event</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Create new event here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                value={name}
                className="col-span-3"
                onChange={(e) => {
                  const inputValue = e.target.value.toUpperCase();
                  if (isValidName(inputValue)) {
                    setName(inputValue);
                  } else {
                    setNameError(
                      "Please enter a valid and unique variable name. Use letters, numbers, underscores or hyphens"
                    );
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isChecked} // Set checkbox state
              onClick={() => {
                setIsChecked(!isChecked);
                setEditable(!editable); // Toggle editable state
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This event is editable
            </label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                onClick={(e) => {
                  if (IsEdit) {
                    handleEditEvent(e);
                  } else {
                    handleCreateEvent(e);
                  }
                }}
              >
                {IsEdit ? "Update" : "Create"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
