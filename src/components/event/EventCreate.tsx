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
import { NotificationType } from "@/utils/Constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

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
  const [notificationType, setNotificationType] = useState("");
  const [id, setId] = useState("");
  const [editable, setEditable] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const form = useForm();

  useEffect(() => {
    if (IsEdit && EditEventDetails != undefined) {
      setName(EditEventDetails?.name);
      setEditable(EditEventDetails?.editable);
      setIsChecked(EditEventDetails?.editable);
      setId(EditEventDetails?.id);
      setNotificationType(EditEventDetails?.notificationType);
    }
  }, [IsEdit]);

  const clearForm = () => {
    setName("");
    setEditable(false);
    setNameError("");
    setVariableError("");
    setNotificationType("");
    setIsChecked(false);
  };

  function isValidName(name: string) {
    let regexp = new RegExp("^[A-Z_]+$");
    return regexp.test(name);
  }

  function handleCreateEvent(values: any) {
    if (!isValidName(name)) {
      setNameError(
        "Please enter a valid app name. Use letters, numbers, underscores or hyphens"
      );
      return;
    }

    let event = {
      name,
      editable,
      notificationType,
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

  function handleEditEvent(values: any) {
    if (!isValidName(name)) {
      setNameError(
        "Please enter a valid app name. Use letters, numbers, underscores or hyphens"
      );
      return;
    }
    editEvent(
      {
        id,
        name,
        editable,
        notificationType,
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                IsEdit ? handleEditEvent : handleCreateEvent
              )}
              className="space-y-8"
            >
              <div className="max-h-[500px] overflow-auto w-full max-w-lg py-4 px-3 gap-4 mb-5">
                <FormItem className="mb-4">
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => {
                      const inputValue = e.target.value.toUpperCase();
                      if (isValidName(inputValue)) {
                        setName(inputValue);
                      } else {
                        setNameError(
                          "Please enter a valid and unique variable name. Use letters, numbers, underscores, or hyphens"
                        );
                      }
                    }}
                  />
                </FormItem>

                <FormItem className="mb-6">
                  <FormLabel>Notification Type</FormLabel>
                  <Select
                    onValueChange={setNotificationType}
                    value={notificationType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type of Notification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={NotificationType.SMS}>
                          {NotificationType.SMS}
                        </SelectItem>
                        <SelectItem value={NotificationType.EMAIL}>
                          {NotificationType.EMAIL}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="mb-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="terms"
                      checked={isChecked}
                      onClick={() => {
                        setIsChecked(!isChecked);
                        setEditable(!editable);
                      }}
                      className="mr-2" // Adding margin to the right of the checkbox
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 col-span-3"
                    >
                      This event is editable
                    </label>
                  </div>
                </FormItem>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">{IsEdit ? "Update" : "Create"}</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
