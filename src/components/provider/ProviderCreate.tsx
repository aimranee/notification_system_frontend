import { useMutation, useQueryClient } from "react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProviderService from "@/services/EmailproviderService";
import { NotificationType, ProviderName } from "@/utils/Constants";
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
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Switch } from "../ui/switch";

export default function ProviderCreate({
  IsEdit = false,
  ProviderDetails,
  ProviderType,
}: {
  IsEdit?: boolean;
  ProviderDetails?: EmailProviderResponse;
  ProviderType?: string;
}) {
  const queryClient = useQueryClient();
  const providerService = new ProviderService();
  const form = useForm();
  const [providerName, setProviderName] = useState("");
  const [providerValue, setProviderValue] = useState("");
  const [notificationType, setNotificationType] = useState(
    NotificationType.SMS
  );

  //twilio
  const [senderId, setSenderId] = useState("");
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");

  //vonage
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  //email provider
  const [mailUsername, setMailUsername] = useState("");
  const [mailPassword, setMailPassword] = useState("");
  const [mailPort, setMailPort] = useState("");
  const [mailHost, setMailHost] = useState("");
  const [sslTrust, setSslTrust] = useState("");
  const [name, setName] = useState("");
  const [smtpAuth, setSmtpAuth] = useState(true);
  const [starttlsEnable, setStarttlsEnable] = useState(true);

  useEffect(() => {
    if (IsEdit && ProviderDetails && ProviderType != undefined) {
      setProviderName(ProviderDetails?.mailProtocol);
      setNotificationType(ProviderType);
      if (ProviderDetails.mailProtocol === ProviderName.TWILIO) {
        // let tempConfig = ProviderDetails.data as TwilioSmsConfig;
        // setAccountSid(tempConfig.account_sid);
        // setAuthToken(tempConfig.auth_token);
        // setSenderId(tempConfig.sender_id);
      } else if (ProviderDetails.mailProtocol === ProviderName.VONAGE) {
        // let tempConfig = ProviderDetails.data as VonageSmsConfig;
        // let api_Key = tempConfig.api_key as ProviderValue;
        // let api_secret = tempConfig.api_secret as ProviderValue;
        // let sender_id = tempConfig.sender_id as ProviderValue;
        // setApiKey(api_Key.value);
        // setApiSecret(api_secret.value);
        // setSenderId(sender_id.value);
      } else if (ProviderDetails.mailProtocol === ProviderName.SMTP) {
        let tempConfig = ProviderDetails;
        setSslTrust(tempConfig.sslTrust);
        setMailHost(tempConfig.mailHost);
        setMailPort(tempConfig.mailPort);
        setName(tempConfig.name);
        setMailUsername(tempConfig.mailUsername);
        setMailPassword(tempConfig.mailPassword);
      }
    }
  }, [IsEdit, ProviderDetails, ProviderType]);

  const clearForm = () => {
    setProviderName("");
    setProviderName("");
    setNotificationType(NotificationType.SMS);
    setSenderId("");
    setApiKey("");
    setSslTrust("");
    setMailHost("");
    setMailPort("");
    setMailUsername("");
    setMailPassword("");
    setApiSecret("");
    setAccountSid("");
    setProviderValue("");
    setAuthToken("");
    setName("");
    setSmtpAuth(false);
    setStarttlsEnable(false);
  };

  const handleSubmit = (values: any) => {
    let policies = undefined;
    if (notificationType === NotificationType.SMS) {
      policies = values?.policy?.reduce(
        (acc: Record<string, any>, row: any) => {
          const policyType = row.policyType;
          const rule = row.rule;
          acc[policyType] = acc[policyType] || [];
          acc[policyType].push(String(rule));
          return acc;
        },
        {}
      );
    }

    if (IsEdit) {
      // handleEditProvider(policies);
    } else {
      handleCreateProvider(policies);
    }
  };

  function handleCreateProvider(policies?: object) {
    let ProviderConfig: any;

    if (providerName == ProviderName.TWILIO) {
      // ProviderConfig = {
      //   account_sid: accountSid,
      //   auth_token: authToken,
      //   sender_id: senderId,
      // } as TwilioSmsConfig;
    } else if (providerName == ProviderName.VONAGE) {
      // ProviderConfig = {
      //   api_key: apiKey,
      //   api_secret: apiSecret,
      //   sender_id: senderId,
      // } as VonageSmsConfig;
    } else if (providerName == ProviderName.SMTP) {
      createEmailProvider(
        {
          name: name,
          mailProtocol: ProviderName.SMTP,
          smtpAuth: smtpAuth,
          starttlsEnable: starttlsEnable,
          sslTrust: sslTrust,
          mailHost: mailHost,
          mailPort: mailPort,
          mailUsername: mailUsername,
          mailPassword: mailPassword,
        },
        {
          onError: (err: any) => {
            toast.error(
              err?.message ? err?.message : "Error creating provider"
            );
          },
          onSuccess: async () => {
            await Promise.all([
              queryClient.invalidateQueries(["getAllProviders"]),
              queryClient.invalidateQueries(["getAllSmsProviders"]),
              queryClient.invalidateQueries(["getAllEmailProviders"]),
            ]);
            toast.success("Provider created successfully");
            clearForm();
          },
        }
      );
    } else {
      toast.error("Select Provider type");
      return;
    }

    // if (providerConfig) {

    // }
  }

  //   function handleEditProvider(policies?: object) {
  //     let ProviderConfig: object;

  //     if (providerName == ProviderName.TWILIO) {
  //       ProviderConfig = {
  //         account_sid: accountSid,
  //         auth_token: authToken,
  //         sender_id: senderId,
  //       } as TwilioSmsConfig;
  //     } else if (providerName == ProviderName.VONAGE) {
  //       ProviderConfig = {
  //         api_key: apiKey,
  //         api_secret: apiSecret,
  //         sender_id: senderId,
  //       } as VonageSmsConfig;
  //     } else if (providerName == ProviderName.SMTP) {
  //       ProviderConfig = {
  //         sender: sslTrust,
  //         smtp_host: mailHost,
  //         smtp_port: Number(mailPort),
  //         smtp_password: mailPassword,
  //         smtp_user_name: mailUsername,
  //       };
  //     }

  //     // editProvider(
  //     //   {
  //     //     name: name,
  //     //     description: description,
  //     //     active: active,
  //     //     app_id: Number(app_id),
  //     //     type: notificationType,
  //     //     provider_type: providerName,
  //     //     config: ProviderConfig!,
  //     //     priority: priority,
  //     //     policy: policies,
  //     //   },
  //     //   {
  //     //     onError: (err: any) => {
  //     //       toast.error(err?.message ? err?.message : "Error editing provider");
  //     //     },
  //     //     onSuccess: async () => {
  //     //       hideModal();
  //     //       await queryClient.invalidateQueries(["getAllSmsProvidersOfApp"]);
  //     //       await queryClient.invalidateQueries(["getAllEmailProvidersOfApp"]);
  //     //       await queryClient.invalidateQueries(["getAllPushProvidersOfApp"]);
  //     //       await queryClient.invalidateQueries(["getAllWebhookProvidersOfApp"]);
  //     //       toast.success("Provider updated successfully");
  //     //       clearForm();
  //     //     },
  //     //   }
  //     // );
  //   }

  //   const { mutate: editProvider } = useMutation(
  //     (data: EditProvider) =>
  //       providerService.editProvider(data, EditProviderDetails?.id),
  //     {
  //       onSuccess: async (data) => {
  //         console.log(data);
  //       },
  //       onSettled: async () => {},
  //     }
  //   );

  const { mutate: createEmailProvider } = useMutation(
    (data: CreateEmailProvider) => providerService.createEmailProvider(data),
    {
      onSuccess: async (data) => {
        console.log(data);
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
            <DialogTitle>Create Provider</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="max-h-[500px] overflow-auto w-full max-w-lg py-4 px-3 gap-4 mb-5">
                <FormItem className="mb-4">
                  <FormLabel>Notification Type</FormLabel>
                  <Select
                    disabled={IsEdit}
                    onValueChange={(value: any) => {
                      setProviderName("");
                      setNotificationType(value);
                    }}
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

                <FormItem className="mb-4">
                  <FormLabel>Provider Name</FormLabel>
                  <Select
                    disabled={IsEdit}
                    value={providerName}
                    onValueChange={(value: any) => setProviderName(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tye of Notification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {notificationType === NotificationType.SMS && (
                          <>
                            <SelectItem value={ProviderName.TWILIO}>
                              Twilio
                            </SelectItem>
                            <SelectItem value={ProviderName.VONAGE}>
                              Vonage
                            </SelectItem>
                          </>
                        )}
                        {notificationType === NotificationType.EMAIL && (
                          <SelectItem value={ProviderName.SMTP}>
                            SMTP
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem className="mb-6">
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormItem>

                {providerName === ProviderName.TWILIO && (
                  <div className="border p-2 mb-4">
                    <span className="font-semibold">{ProviderName.TWILIO}</span>
                    <FormItem className="mb-4">
                      <FormLabel>Account Sid"</FormLabel>
                      <Input
                        value={accountSid}
                        onChange={(e) => setAccountSid(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>Auth Token</FormLabel>
                      <Input
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>Sender Id</FormLabel>
                      <Input
                        value={senderId}
                        onChange={(e) => setSenderId(e.target.value)}
                      />
                    </FormItem>
                  </div>
                )}

                {providerName === ProviderName.VONAGE && (
                  <div className="border p-2 mb-4">
                    <span className="font-semibold">{ProviderName.VONAGE}</span>
                    <FormItem className="mb-4">
                      <FormLabel>Api Key</FormLabel>
                      <Input
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>Api Secret</FormLabel>
                      <Input
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>Sender Id</FormLabel>
                      <Input
                        value={senderId}
                        onChange={(e) => setSenderId(e.target.value)}
                      />
                    </FormItem>
                  </div>
                )}

                {providerName === ProviderName.SMTP && (
                  <div className="border p-2 mb-4">
                    <span className="font-semibold">{ProviderName.SMTP}</span>
                    <FormItem className="mb-4">
                      <FormLabel>SMTP Host</FormLabel>
                      <Input
                        value={mailHost}
                        onChange={(e) => setMailHost(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>SMTP Port</FormLabel>
                      <Input
                        value={mailPort}
                        onChange={(e) => setMailPort(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>SMTP Username</FormLabel>
                      <Input
                        value={mailUsername}
                        onChange={(e) => setMailUsername(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>SMTP Password</FormLabel>
                      <Input
                        value={mailPassword}
                        onChange={(e) => setMailPassword(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4">
                      <FormLabel>SSL Trust</FormLabel>
                      <Input
                        value={sslTrust}
                        onChange={(e) => setSslTrust(e.target.value)}
                      />
                    </FormItem>
                    <FormItem className="mb-4 flex justify-between items-center">
                      <FormLabel>Smtp Auth</FormLabel>
                      <div className="flex items-center">
                        <Switch
                          checked={smtpAuth}
                          onCheckedChange={setSmtpAuth}
                          aria-readonly
                        />
                      </div>
                    </FormItem>
                    <FormItem className="mb-4 flex justify-between items-center">
                      <FormLabel className="mr-2">Starttls</FormLabel>
                      <div className="flex items-center">
                        <Switch
                          checked={starttlsEnable}
                          onCheckedChange={setStarttlsEnable}
                          aria-readonly
                        />
                      </div>
                    </FormItem>
                  </div>
                )}

                {notificationType === NotificationType.SMS && (
                  <div className="border p-2 mt-2 mb-4">
                    <span className="font-semibold block pb-2">
                      <div className="flex items-end gap-1">
                        Policy
                        {/* <Tooltip
                          title={
                            <div>
                              All type of policy must satisfy and for each
                              policy type minimum one condition must satisfy.
                              <br /> Example: Receiver Country can be multiple
                              but at least one must satisfy
                            </div>
                          }
                        >
                          <InfoCircleTwoTone />
                        </Tooltip> */}
                      </div>
                    </span>
                    {/* <Form name="policy">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Policy
                            form={form}
                            key={index}
                            field={field}
                            remove={remove}
                          />
                        ))}

                        <FormItem>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={}
                          >
                            <PlusIcon />
                            Add Policy
                          </Button>
                        </FormItem>
                      </>
                    )}
                  </Form> */}
                  </div>
                )}
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
