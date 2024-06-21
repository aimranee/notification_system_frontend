import { useMutation, useQueryClient } from "react-query";
import React, { useEffect, useState } from "react";
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
import { Form, FormItem, FormLabel } from "../ui/form";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "../ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import ClientAppService from "@/services/clientAppService";
import { isValidClientId } from "@/utils/ValidationUtils";

export default function ClientAppCreate({
  IsEdit = false,
  ClientAppDetails,
}: {
  IsEdit?: boolean;
  ClientAppDetails?: ClientAppResponse;
}) {
  const { toast } = useToast();
  const { data: session } = useSession();

  const queryClient = useQueryClient();
  const clientAppService = new ClientAppService(
    session?.user?.access_token || ""
  );
  const form = useForm();
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (IsEdit && ClientAppDetails != undefined) {
      setName(ClientAppDetails?.name);
      setClientId(ClientAppDetails?.clientId);
      setEnabled(ClientAppDetails?.enabled);
    }
  }, [IsEdit, ClientAppDetails]);

  const clearForm = () => {
    setName("");
    setClientId("");
    setEnabled(false);
  };

  const handleSubmit = (values: any) => {
    if (IsEdit) {
      // handleEditClientApp(policies);
    } else {
      handleCreateClientApp();
    }
  };

  function handleCreateClientApp() {
    createClientApp(
      {
        name: name,
        clientId: clientId,
        enabled: enabled,
      },
      {
        onError: (err: any) => {
          toast(
            err?.message
              ? err?.message
              : {
                  variant: "destructive",
                  title: "Something went wrong.",
                  description: "Error creating provider",
                }
          );
        },
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries(["getAllClientsApp"]),
          ]);
          toast({ description: "Application created successfully" });
          clearForm();
        },
      }
    );
  }

  const { mutate: createClientApp } = useMutation(
    (data: CreateClientApp) => clientAppService.createClientApp(data),
    {
      onSuccess: async (data) => {
        // await Promise.all([
        //   queryClient.invalidateQueries(["getAllClientsApp"]),
        // ]);
        // toast({ description: "Application created successfully" });
      },
      onSettled: async () => {},
    }
  );

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {IsEdit ? (
            <Button variant="ghost">Edit</Button>
          ) : (
            <Button size="sm" className="h-7 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Application
              </span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create new application</DialogTitle>
            <DialogDescription>
              Make changes to your applications here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="max-h-[500px] overflow-auto w-full max-w-lg py-4 px-3 gap-4 mb-5">
                <FormItem className="mb-4">
                  <FormLabel>Application Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormItem>
                <FormItem className="mb-8">
                  <FormLabel>ClientId</FormLabel>
                  <Input
                    value={clientId}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (isValidClientId(inputValue)) {
                        setClientId(inputValue);
                      }
                    }}
                  />
                </FormItem>
                <FormItem className="mb-4 flex justify-between items-center">
                  <FormLabel>Active</FormLabel>
                  <div className="flex items-center">
                    <Switch
                      checked={enabled}
                      onCheckedChange={setEnabled}
                      aria-readonly
                    />
                  </div>
                </FormItem>
              </div>
              <DialogClose asChild>
                <DialogFooter>
                  <Button type="submit">{IsEdit ? "Update" : "Create"}</Button>
                </DialogFooter>
              </DialogClose>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
