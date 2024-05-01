import React, {
  Fragment,
  ReactElement,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { NotificationType } from "@/utils/Constants";
import { Languages_list } from "@/utils/CountryList";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import { toast } from "react-toastify";
import { CopyOutlined } from "@ant-design/icons";
import Layout from "@/components/layouts/Layout";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmailTemplate from "@/components/emailTemplate";
import ProviderService from "@/services/EmailproviderService";
import EventList from "@/components/template/EventList";
import EventService from "@/services/eventService";
import { Checkbox } from "@/components/ui/checkbox";

const Event = () => {
  const [isShowEventEditor, setIsShowEventEditor] = useState(false);
  const eventService = new EventService();
  const providerService = new ProviderService();
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

  // const { data: allEventsResp } = useQuery(["getAllEvents"], () =>
  //   eventService.getAllEvents()
  // );

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
  }: {
    html?: string;
    design?: string;
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
      // active: isActive,
      // title: title,
      // file: imageLink,
      language: language,
    });
  };

  const onFinish = async (values: unknown) => {
    if (notificationType === NotificationType.EMAIL) {
      emailEditorRef?.current?.editor.exportHtml((data: any) => {
        const { design, html } = data;
        createEventFunc({ design, html });
      });
      return;
    }
    createEventFunc({});
  };

  return (
    <Fragment>
      <div className="text-right">
        <Button
          onClick={() => {
            setIsShowEventEditor((prevState) => !prevState);
          }}
        >
          Create Event
        </Button>
      </div>
      <div>
        {isShowEventEditor && (
          <Card>
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
                                const inputValue = e.target.value.toUpperCase();
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
                              className="mr-2" // Adding margin to the right of the checkbox
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
                </CardContent>
                <Button type="submit" className="ml-auto block mb-5 mt-5">
                  Create
                </Button>
              </form>
            </Form>
          </Card>
        )}

        <div className="pt-3">
          <h2 className="text-2xl font-semibold pb-2">Events</h2>
          <div
            className="flex flex-col rounded-lg border border-dashed shadow-sm p-4"
            x-chunk="dashboard-02-chunk-1"
          >
            <EventList />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Event.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Event;
