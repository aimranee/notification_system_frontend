import { useQuery } from "react-query";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TemplateEmailList } from "./TemplateEmailList";
import { TemplateSmsList } from "./TemplateSmsList";
import TemplateService from "@/services/TemplateService";
import { useSession } from "next-auth/react";

export default function EventList({ appId }: { appId: string }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // window is accessible here.
    // console.log("window.innerHeight", window.innerHeight);
  }, []);
  const eventService = new TemplateService(session?.user?.access_token || "");

  const { data: emailTemplatesResp } = useQuery(["getAllEmailTemplates"], () =>
    eventService.getAllEmailTemplates(appId)
  );

  const { data: smsTemplatesResp } = useQuery(["getAllSmsTemplates"], () =>
    eventService.getAllEmailTemplates(appId)
  );

  const tabs = [
    {
      label: "Email",
      value: "email",
      children: <TemplateEmailList allTemplatesResp={emailTemplatesResp} />,
    },
    {
      label: "SMS",
      value: "sms",
      children: <TemplateSmsList allTemplatesResp={smsTemplatesResp} />,
    },
  ];

  return (
    <>
      <Tabs defaultValue="email">
        <TabsList className="grid w-full grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.children}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
