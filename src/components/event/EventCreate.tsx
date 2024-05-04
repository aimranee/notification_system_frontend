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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useRef, useState } from "react";
import EmailProviderService from "@/services/EmailproviderService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { NotificationType } from "@/utils/Constants";
import { Languages_list } from "@/utils/CountryList";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CopyToClipboard } from "@/utils/CopyToClipboard";
import EmailTemplate from "../emailTemplate";
import { ScrollArea } from "../ui/scroll-area";
import TemplateService from "@/services/TemplateService";

interface TableRowData {
  code: string;
  validation: string;
}

const initialRowData: TableRowData = {
  code: "",
  validation: "",
};

export default function EventCreate({
  IsEdit = false,
  EventDetails,
  EventType,
}: {
  IsEdit?: boolean;
  EventDetails?: EventResponse;
  EventType?: string;
}) {
  const [isShowEventEditor, setIsShowEventEditor] = useState(false);
  const eventService = new TemplateService();
  const providerService = new EmailProviderService();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [eventName, setEventName] = useState("");
  const [id, setId] = useState("");
  const [editable, setEditable] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const queryClient = useQueryClient();
  const emailEditorRef = useRef<any>(null);
  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [notifTypeCheck, setNotifTypeCheck] = useState(true);
  const [language, setLanguage] = useState("en");
  const form = useForm();
  const [variables, setVariables] = useState<string[] | undefined>([]);
  const [variable, setVariable] = useState("");
  const [rows, setRows] = useState<TableRowData[]>([initialRowData]);

  // useEffect(() => {
  //   if (IsEdit && ProviderDetails && ProviderType != undefined) {
  //     setProviderName(ProviderDetails?.mailProtocol);
  //     setNotificationType(ProviderType);
  //     if (ProviderDetails.mailProtocol === ProviderName.TWILIO) {
  //       // let tempConfig = ProviderDetails.data as TwilioSmsConfig;
  //       // setAccountSid(tempConfig.account_sid);
  //       // setAuthToken(tempConfig.auth_token);
  //       // setSenderId(tempConfig.sender_id);
  //     } else if (ProviderDetails.mailProtocol === ProviderName.VONAGE) {
  //       // let tempConfig = ProviderDetails.data as VonageSmsConfig;
  //       // let api_Key = tempConfig.api_key as ProviderValue;
  //       // let api_secret = tempConfig.api_secret as ProviderValue;
  //       // let sender_id = tempConfig.sender_id as ProviderValue;
  //       // setApiKey(api_Key.value);
  //       // setApiSecret(api_secret.value);
  //       // setSenderId(sender_id.value);
  //     } else if (ProviderDetails.mailProtocol === ProviderName.SMTP) {
  //       let tempConfig = ProviderDetails;
  //       setSslTrust(tempConfig.sslTrust);
  //       setMailHost(tempConfig.mailHost);
  //       setMailPort(tempConfig.mailPort);
  //       setName(tempConfig.name);
  //       setMailUsername(tempConfig.mailUsername);
  //       setMailPassword(tempConfig.mailPassword);
  //     }
  //   }
  // }, [IsEdit, ProviderDetails, ProviderType]);

  const { data: providersResp } = useQuery(["getAllProviders"], () =>
    providerService.getAllEmailProviders()
  );

  const { mutate: createEvent } = useMutation(
    (data: CreateEvent) => eventService.createEvent(data),
    {
      onSuccess: async (data) => {
        toast.success("Event created successfully");
        setIsShowEventEditor(false);
        setEditable(false);
        setIsChecked(false);
        setIsActive(false);
        setEventName("");
        setDescription("");
        setNotificationType("");
        setLanguage("en");
        await queryClient.invalidateQueries(["getAllEvents"]);
      },
      onSettled: async () => {},
    }
  );

  function isValidName(name: string) {
    let regexp = new RegExp("^[A-Z_]+$");
    return regexp.test(name);
  }

  const selectedProvider = providersResp?.find(
    (provider) => provider.name === providerName
  );

  const createEventFunc = ({
    design,
    html,
    assembledData,
  }: {
    html?: string;
    design?: string;
    assembledData?: string;
  }) => {
    createEvent({
      eventName: eventName,
      editable: editable,
      notificationType: notificationType,
      emailProvider: selectedProvider as EmailProviderResponse,
      description: description,
      message: smsBody,
      subject: subject,
      emailRenderedHtml: html,
      emailMarkup: JSON.stringify(design),
      language: language,
      variables: assembledData,
    });
  };

  const addRow = () => {
    setRows([...rows, { ...initialRowData }]); // Create a new object for each row
  };

  const handleInputChange = <T extends keyof TableRowData>(
    index: number,
    field: T,
    value: TableRowData[T]
  ) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index], // Preserve other properties of the row
      [field]: value,
    };
    setRows(updatedRows);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index)); // Filter out the row to be removed
  };

  const assembleData = () => {
    let assembledString = "";
    rows.forEach((row, index) => {
      assembledString += `${row.code}: ${row.validation}`;
      if (index !== rows.length - 1) {
        assembledString += ", ";
      }
    });
    return assembledString;
  };

  const onFinish = async (values: unknown) => {
    if (notificationType === NotificationType.EMAIL) {
      emailEditorRef?.current?.editor.exportHtml((data: any) => {
        const { design, html } = data;
        const assembledData = assembleData(); // Call assembleData function
        createEventFunc({ design, html, assembledData }); // Pass assembledData to createEventFunc
      });
      return;
    }
    createEventFunc({});
  };
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
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
            <Card>
              {/* <ScrollArea className="h-400 w-800 rounded-md border"> */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onFinish)}
                  className="space-y-8"
                >
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 lg:w-8/12">
                      <div className="grid gap-6 sm:grid-cols-3">
                        <div className="grid gap-3">
                          <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                              <Input
                                value={eventName}
                                onChange={(e) => {
                                  const inputValue =
                                    e.target.value.toUpperCase();
                                  if (isValidName(inputValue)) {
                                    setEventName(inputValue);
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        </div>

                        <div className="grid gap-3">
                          <FormItem>
                            <FormLabel>Notification Type</FormLabel>
                            <Select
                              onValueChange={(value: any) => {
                                setProviderName(value);
                                setNotifTypeCheck(false);
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
                        </div>

                        <div className="grid gap-3">
                          <FormItem>
                            <FormLabel>Provider Name</FormLabel>
                            <FormControl>
                              <Select
                                disabled={notifTypeCheck}
                                onValueChange={(value: any) => {
                                  setProviderName(value);
                                }}
                              >
                                <SelectTrigger
                                  id="providerName"
                                  aria-label="Select Provider Name"
                                >
                                  <SelectValue placeholder="Default" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="null">Default</SelectItem>
                                  {providersResp?.map((provider) => {
                                    return (
                                      <SelectItem
                                        value={provider.name}
                                        key={provider.id}
                                      >
                                        {provider.name}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        </div>

                        <div className="grid gap-3">
                          <FormItem>
                            <FormLabel>This event is editable</FormLabel>
                            <div className="flex items-center">
                              <Switch
                                id="terms"
                                checked={isChecked}
                                onClick={() => {
                                  setIsChecked(!isChecked);
                                  setEditable(!editable);
                                }}
                                className="mr-2"
                              />
                            </div>
                          </FormItem>
                        </div>

                        <div className="grid gap-3">
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                              <Select onValueChange={setLanguage}>
                                <SelectTrigger
                                  id="language"
                                  aria-label="Select language"
                                >
                                  <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Languages_list?.map((language) => {
                                    return (
                                      <SelectItem
                                        value={language.value}
                                        key={language.value}
                                      >
                                        {language.label}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              id="description"
                              className="min-h-20"
                              onChangeCapture={(e) =>
                                setDescription(e.currentTarget.value)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </div>

                      <div className="grid gap-6">
                        <Card x-chunk="dashboard-07-chunk-1">
                          <CardHeader>
                            <CardTitle>Variables</CardTitle>
                            <CardDescription>
                              Enter variable name and press enter
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">
                                    CODE
                                  </TableHead>
                                  <TableHead className="w-[100px]">
                                    Validation
                                  </TableHead>
                                  <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {rows.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Input
                                        id={`code-${index}`}
                                        value={row.code}
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "code",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter code"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        id={`validation-${index}`}
                                        value={row.validation}
                                        onChange={(e) =>
                                          handleInputChange(
                                            index,
                                            "validation",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter validation"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <ToggleGroup
                                        type="single"
                                        defaultValue="m"
                                        variant="outline"
                                      >
                                        <ToggleGroupItem
                                          value="s"
                                          onClick={() => {
                                            CopyToClipboard(row.code);
                                          }}
                                        >
                                          S
                                        </ToggleGroupItem>
                                        <ToggleGroupItem
                                          onClick={() => removeRow(index)}
                                          value=""
                                        >
                                          D
                                        </ToggleGroupItem>
                                      </ToggleGroup>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                          <CardFooter className="justify-center border-t p-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1"
                              onClick={addRow}
                            >
                              <PlusCircle className="h-3.5 w-3.5" />
                              Add Variant
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>

                      {notificationType === "email" && (
                        <div className="grid gap-6">
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input
                                id="name"
                                type="text"
                                className="w-full"
                                onChangeCapture={(e) =>
                                  setSubject(e.currentTarget.value)
                                }
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                      )}
                    </div>

                    {notificationType === "email" && (
                      <div className="grid gap-6">
                        <FormItem>
                          <FormLabel>Email Body</FormLabel>
                          <FormControl>
                            <EmailTemplate ref={emailEditorRef} />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}

                    {notificationType === "sms" && (
                      <div className="grid gap-6">
                        <FormItem>
                          <FormLabel>SMS Body</FormLabel>
                          <FormControl>
                            <Textarea
                              onChangeCapture={(e) =>
                                setSmsBody(e.currentTarget.value)
                              }
                              rows={4}
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}

                    <DialogClose asChild>
                      <DialogFooter>
                        <Button type="submit">
                          {IsEdit ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </DialogClose>
                  </CardContent>
                </form>
              </Form>
              {/* </ScrollArea> */}
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
