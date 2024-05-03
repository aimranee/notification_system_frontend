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
import EventService from "@/services/eventService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import { toast } from "react-toastify";
import { CopyOutlined } from "@ant-design/icons";
import Layout from "@/components/layouts/Layout";
import TemplateService from "@/services/templateService";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmailTemplate from "@/components/emailTemplate";
import ProviderService from "@/services/EmailproviderService";
import TemplateList from "@/components/template/TemplateList";

const Template = () => {
  const [isShowTemplateEditor, setIsShowTemplateEditor] = useState(false);
  const eventService = new EventService();
  const providerService = new ProviderService();
  const templateService = new TemplateService();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [providerName, setProviderName] = useState("");
  const [method, setMethod] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const queryClient = useQueryClient();
  const emailEditorRef = useRef<any>(null);
  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [notifTypeCheck, setNotifTypeCheck] = useState(true);
  const [language, setLanguage] = useState("en");
  const form = useForm();

  const { data: allEventsResp } = useQuery(["getAllEvents"], () =>
    eventService.getAllEvents()
  );

  const { data: providersResp } = useQuery(["getAllProviders"], () =>
    providerService.getAllEmailProviders()
  );

  const { mutate: createTemplate } = useMutation(
    (data: CreateTemplate) => templateService.createTemplate(data),
    {
      onSuccess: async (data) => {
        toast.success("Template created successfully");
        setIsShowTemplateEditor(false);
        setIsActive(false);
        setEventType("");
        setDescription("");
        setMethod("");
        setLanguage("en");
        await queryClient.invalidateQueries(["getAllTemplates"]);
      },
      onSettled: async () => {},
    }
  );

  const selectedEvent = allEventsResp?.find(
    (event) => event.name === eventType
  );

  const selectedProvider = providersResp?.find(
    (provider) => provider.name === providerName
  );

  const createTemplateFunc = ({
    design,
    html,
  }: {
    html?: string;
    design?: string;
  }) => {
    createTemplate({
      event: selectedEvent as EventResponse,
      emailProvider: selectedProvider as EmailProviderResponse,
      type: method,
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
    if (method === NotificationType.EMAIL) {
      emailEditorRef?.current?.editor.exportHtml((data: any) => {
        const { design, html } = data;
        createTemplateFunc({ design, html });
      });
      return;
    }
    createTemplateFunc({});
  };

  return (
    <Fragment>
      <div className="text-right">
        <Button
          onClick={() => {
            setIsShowTemplateEditor((prevState) => !prevState);
          }}
        >
          Create Template
        </Button>
      </div>
      <div>
        {isShowTemplateEditor && (
          // <div className="my-3">

          //       <div className="grid grid-cols-5 w-3/4 gap-x-3">
          //         <FormItem
          //         // label="Event Type"
          //         // name="Event Type"
          //         // rules={[{ required: true }]}
          //         // className="col-span-2"
          //         >
          //         <FormItem
          //         // name="Notification Type"
          //         // label="Notification Type"
          //         // rules={[{ required: true }]}
          //         // className="col-span-2"
          //         >
          //           <FormLabel>Notification Type</FormLabel>

          //           {/* <Select onChange={setMethod}>
          //             <Option value={NotificationType.EMAIL}>Email</Option>
          //             <Option value={NotificationType.SMS}>SMS</Option>
          //             <Option value={NotificationType.PUSH}>Push</Option>
          //           </Select> */}
          //         </FormItem>
          //         <FormItem
          //         // name="language"
          //         // label="Language"
          //         // className="col-span-1"
          //         >
          //           <FormLabel>Language</FormLabel>

          //           {/* <Select
          //             dropdownMatchSelectWidth={false}
          //             optionLabelProp="value"
          //             defaultValue={"en"}
          //             options={Languages_list}
          //             value={language}
          //             onChange={setLanguage}
          //           /> */}
          //         </FormItem>
          //       </div>

          //       <div style={{ width: "75%" }}>
          //         <FormItem
          //         // name="description"
          //         // label="Description"
          //         >
          //           <FormLabel>Description</FormLabel>

          //           <Textarea
          //             onChange={(e) => setDescription(e.target.value)}
          //           />
          //         </FormItem>
          //         {selectedEvent && (
          //           <>
          //             <h3 className="mb-1.5">Usable Variables</h3>

          //             <div className="flex gap-5 flex-wrap pb-5">
          //               {/* {selectedEvent?.variables?.map(
          //                 (
          //                   variable:
          //                     | boolean
          //                     | React.ReactElement<
          //                         any,
          //                         string | React.JSXElementConstructor<any>
          //                       >
          //                     | React.ReactFragment
          //                     | React.Key
          //                     | null
          //                     | undefined
          //                 ) => {
          //                   return (
          //                     <Button
          //                       type="dashed"
          //                       key={variable}
          //                       size="large"
          //                       className="flex items-center"
          //                       onClick={() => {
          //                         copyToClipboard(variable);
          //                       }}
          //                     >
          //                       {variable}
          //                       <CopyOutlined />
          //                     </Button>
          //                   );
          //                 }
          //               )} */}
          //             </div>
          //           </>
          //         )}
          //         {method === "email" && (
          //           <FormItem
          //           // name="subject"
          //           // label="Subject"
          //           >
          //             <FormLabel>Subject</FormLabel>

          //             <Input
          //               onChange={(event: {
          //                 target: { value: React.SetStateAction<string> };
          //               }) => setSubject(event.target.value)}
          //             />
          //           </FormItem>
          //         )}
          //       </div>

          //       {method === "sms" && (
          //         <FormItem
          //         // name="sms-body"
          //         // isList
          //         // label="SMS Body"
          //         // className="w-3/4"
          //         >
          //           <FormLabel>SMS Body</FormLabel>
          //           <Textarea
          //             onChange={(e: {
          //               target: { value: React.SetStateAction<string> };
          //             }) => setSmsBody(e.target.value)}
          //             rows={4}
          //           />
          //         </FormItem>
          //       )}
          //     </form>
          //   </Form>
          //   {method === "email" && (
          //     <div className="mb-5">
          //       <h3 className="text-base pb-3 max-w-3xl mx-auto">Email Body</h3>
          //       {/* <EmailTemplate ref={emailEditorRef} /> */}
          //     </div>
          //   )}
          //   <div className="max-w-3xl mx-auto">
          //     <label htmlFor="isActive" className="cursor-pointer pr-2">
          //       Active
          //     </label>
          //     {/* <Switch
          //       // onChange={setIsActive}
          //       id="isActive"
          //       checked={isActive}
          //       className="bg-gray-500"
          //     /> */}
          //   </div>
          //   <Button
          //     // type="primary"
          //     className="bg-blue-700 ml-auto block mb-5 mt-5"
          //     // htmlType="submit"
          //     onClick={() => {
          //       // formRef.current?.submit();
          //     }}
          //   >
          //     Create
          //   </Button>
          // </div>

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
                          <FormLabel>Event Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value: any) => {
                                setEventType(value);
                              }}
                            >
                              <SelectTrigger
                                id="event"
                                aria-label="Select Event"
                              >
                                <SelectValue placeholder="Select Event" />
                              </SelectTrigger>
                              <SelectContent>
                                {allEventsResp?.map((event) => {
                                  return (
                                    <SelectItem
                                      value={event.name}
                                      key={event.id}
                                    >
                                      {event.name}
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
                          <FormLabel>Notification Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value: any) => {
                                setMethod(value);
                                if (value === NotificationType.EMAIL)
                                  setNotifTypeCheck(false);
                              }}
                            >
                              <SelectTrigger
                                id="NotificationType"
                                aria-label="Select Notification Type"
                              >
                                <SelectValue placeholder="Select Notification Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={NotificationType.EMAIL}>
                                  Email
                                </SelectItem>
                                <SelectItem value={NotificationType.SMS}>
                                  SMS
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
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
                                <SelectValue placeholder="Select Provider Name" />
                              </SelectTrigger>
                              <SelectContent>
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

                    {method === "email" && (
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

                  {method === "email" && (
                    <div className="grid gap-6">
                      <FormItem>
                        <FormLabel>Email Body</FormLabel>
                        <FormControl>
                          <EmailTemplate ref={emailEditorRef} />
                        </FormControl>
                      </FormItem>
                    </div>
                  )}

                  {method === "sms" && (
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
          <h2 className="text-2xl font-semibold pb-2">Templates</h2>
          <div
            className="flex flex-col rounded-lg border border-dashed shadow-sm p-4"
            x-chunk="dashboard-02-chunk-1"
          >
            <TemplateList />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Template.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Template;
