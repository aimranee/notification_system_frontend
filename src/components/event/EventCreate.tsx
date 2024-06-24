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
import { PlusCircle, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useEffect, useRef, useState } from "react";
import EmailProviderService from "@/services/EmailproviderService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { NotificationType } from "@/utils/Constants";
import { Languages_list } from "@/utils/CountryList";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "../ui/scroll-area";
import { CopyIcon } from "@radix-ui/react-icons";
import TemplateService from "@/services/TemplateService";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import EmailEditor from "react-email-editor";
import {
  assembleData,
  checkEmailVariablesExist,
  extractVariablesFromEmailBody,
  findMissingVariables,
} from "@/utils/EmailUtils";
import { transformToVariable } from "@/utils/StringFormat";
import { validateInputs, isValidName } from "@/utils/ValidationUtils";
import { copyToClipboard } from "@/utils/CopyToClipboard";
import { useSession } from "next-auth/react";
import { template } from "@/config/template";


export default function EventCreate({
  IsEdit = false,
  EventDetails,
  appId,
}: {
  IsEdit?: boolean;
  EventDetails?: EventResponse;
  appId?: string;
}) {
  const { data: session, status } = useSession();
  const eventService = new TemplateService(session?.user?.access_token || "");
  const providerService = new EmailProviderService(
    session?.user?.access_token || ""
  );
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [eventName, setEventName] = useState("");
  const [editable, setEditable] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [language, setLanguage] = useState("en");
  const queryClient = useQueryClient();
  const emailEditorRef = useRef<any>(null);
  const [notifTypeCheck, setNotifTypeCheck] = useState(true);
  const form = useForm();
  const [variables, setVariables] = useState([{ code: "", validation: "" }]);
  const { toast } = useToast();
  const [isShowEmailEditor, setIsShowEmailEditor] = useState(false);
  const { data: providersResp } = useQuery(["getAllProviders"], () =>
    providerService.getAllEmailProviders()
  );

  const regexCode: RegExp =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

  const { mutate: createEvent } = useMutation(
    (data: CreateEvent) => eventService.createEvent(data),
    {
      onSuccess: async (data) => {
        toast({ description: "Event created successfully" });
        setEditable(false);
        setIsChecked(false);
        setEventName("");
        setDescription("");
        setNotificationType("");
        setLanguage("en");
        setDescription("");
        setSubject("");
        setVariables([
          { code: "PREFERENCES_LINK", validation: regexCode.source },
        ]);
        await Promise.all([
          queryClient.invalidateQueries(["getAllEmailTemplates"]),
        ]);
      },
      onSettled: async () => {},
    }
  );

  useEffect(() => {
    setTimeout(() => {
      setIsShowEmailEditor(true);
    });
    setVariables([{ code: "PREFERENCES_LINK", validation: regexCode.source }]);
    emailEditorRef?.current?.editor?.loadDesign(template);
    if (IsEdit && EventDetails != undefined) {
      setEventName(EventDetails?.eventName);
      setEditable(EventDetails.editable);
      setDescription(EventDetails.description);
      setProviderName(EventDetails.emailProviderName);
      if (EventDetails.notificationType == "email") {
        emailEditorRef?.current?.editor?.loadDesign(EventDetails.markup);
        setSubject(EventDetails.subject);
        const parsedVariables = JSON.parse(EventDetails.variables);
        if (Array.isArray(parsedVariables)) {
          setVariables(parsedVariables);
        }
      }
    }
  }, [IsEdit, EventDetails]);

  const onLoad = () => {
    emailEditorRef.current?.editor?.loadDesign(template);
  };

  const onReady = () => {
    emailEditorRef.current?.editor?.loadDesign(template);
  };

  const selectedProvider =
    providersResp?.find((provider) => provider.name === providerName) || null;

  const createEventFunc = ({
    design,
    html,
    assembledData,
  }: {
    html?: string;
    design?: string;
    assembledData?: string;
  }) => {
    createEvent(
      {
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
        clientAppId: appId?.toString(),
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
          toast({ description: "Event created successfully" });
          setEditable(false);
          setIsChecked(false);
          setEventName("");
          setDescription("");
          setNotificationType("");
          setLanguage("en");
          setDescription("");
          setSubject("");
          setVariables([
            { code: "PREFERENCES_LINK", validation: regexCode.source },
          ]);
          await Promise.all([
            queryClient.invalidateQueries(["getAllEmailTemplates"]),
          ]);
        },
      }
    );
  };

  const addVariant = () => {
    setVariables([...variables, { code: "", validation: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof Variable,
    value: string
  ) => {
    const updatedVariables = [...variables];
    updatedVariables[index][field] = value;
    setVariables(updatedVariables);
  };

  const removeRow = (index: number) => {
    const updatedVariables = [...variables];
    updatedVariables.splice(index, 1);
    setVariables(updatedVariables);
  };

  const onFinish = async (values: unknown) => {
    if (notificationType === NotificationType.EMAIL) {
      emailEditorRef?.current?.editor.exportHtml((data: any) => {
        const { design, html } = data;
        const assembledData = assembleData(variables);
        createEventFunc({ design, html, assembledData });
        const isVariablesExist = checkEmailVariablesExist(html, variables);
        const emailBodyVariables = extractVariablesFromEmailBody(html); // Extract variables from email body
        const missingVariables = findMissingVariables(
          emailBodyVariables,
          variables
        ); // Find missing variables
        if (missingVariables?.length > 0) {
          toast({
            variant: "destructive",
            title: "Something went wrong.",
            description: `Error: ${missingVariables?.join(
              ", "
            )} do not exist in variables list`,
          });
        }
        if (!isVariablesExist) {
          toast({
            variant: "destructive",
            title: "Something went wrong.",
            description:
              "One or more variables do not exist in the template or SMS body.",
          });
        }
        if (!validateInputs(variables)) {
          toast({
            variant: "destructive",
            title: "Something went wrong.",
            description: `Invalid regex pattern for variables`,
          });
        }
      });
    }
  };

  const handleCopyClick = (code: string) => {
    copyToClipboard(transformToVariable(code));
    toast({ description: "Copied to clipboard : " + code });
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
              Make changes to your event here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
            <Card>
              <ScrollArea className="h-400 w-800 rounded-md border">
                <CardHeader>
                  <CardTitle>Template Details</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <Form {...form}>
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
                                value={providerName}
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
                      {(notificationType === "email" ||
                        notificationType === "sms") && (
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
                                  {variables.map((variable, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {variable.code == "PREFERENCES_LINK" ? (
                                          <Input
                                            id={`code-${index}`}
                                            value={variable.code}
                                            disabled
                                          />
                                        ) : (
                                          <Input
                                            id={`code-${index}`}
                                            value={variable.code}
                                            onChange={(e) => {
                                              const inputValue =
                                                e.target.value.toUpperCase();
                                              if (isValidName(inputValue)) {
                                                handleInputChange(
                                                  index,
                                                  "code",
                                                  inputValue
                                                );
                                              }
                                            }}
                                            placeholder="Enter code"
                                          />
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {variable.code == "PREFERENCES_LINK" ? (
                                          <Input
                                            id={`validation-${index}`}
                                            value={variable.validation}
                                            disabled
                                          />
                                        ) : (
                                          <Input
                                            id={`validation-${index}`}
                                            value={variable.validation}
                                            onChange={(e) =>
                                              handleInputChange(
                                                index,
                                                "validation",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Enter validation"
                                          />
                                        )}
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
                                              handleCopyClick(variable.code);
                                            }}
                                          >
                                            <span className="sr-only">
                                              Copy
                                            </span>
                                            <CopyIcon className="h-4 w-4" />
                                          </ToggleGroupItem>
                                          <ToggleGroupItem
                                            onClick={() => removeRow(index)}
                                            value=""
                                          >
                                            <span className="sr-only">
                                              Delete
                                            </span>
                                            <Trash2 className="h-4 w-4" />
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
                                onClick={addVariant}
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                                Add Variant
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      )}

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
                            {isShowEmailEditor ? (
                              <EmailEditor
                                ref={emailEditorRef}
                                onLoad={onLoad}
                                onReady={onReady}
                                projectId={138679}
                              />
                            ) : (
                              <div className="h-[500px] flex justify-center items-center">
                                {/* <Spin size="large" /> */}
                              </div>
                            )}
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
                              rows={2}
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                    )}

                    {/* <DialogClose asChild> */}
                    <DialogFooter>
                      <form
                        onSubmit={form.handleSubmit(onFinish)}
                        className="space-y-8"
                      >
                        <Button type="submit">
                          {IsEdit ? "Update" : "Create"}
                        </Button>
                      </form>
                    </DialogFooter>
                    {/* </DialogClose> */}
                  </CardContent>
                </Form>
              </ScrollArea>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
