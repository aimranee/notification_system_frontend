import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function EventCreate({
  IsEdit = false,
}: {
  IsEdit?: boolean;
  EditEventDetails?: EventResponse;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variables, setVariables] = useState<string[] | undefined>([]);
  const [variable, setVariable] = useState("");

  function isValidName(name: string) {
    let regexp = new RegExp("^[A-Za-z0-9_-]+$");
    return regexp.test(name);
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isValidName(variable) && !variables?.includes(variable)) {
        setVariables([...(variables || []), e.currentTarget.value]);
        setVariable("");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Create Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Create new event here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input value={name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Name
            </Label>
            <Textarea rows={4} value={description} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              variable
            </Label>
            <Input
              onKeyDown={handleKeyDown}
              value={variable}
              className="col-span-3"
              placeholder="Enter variable name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{IsEdit ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
