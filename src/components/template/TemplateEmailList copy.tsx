import { useQuery } from "react-query";
import TemplateService from "@/services/templateService";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TemplateEmailList } from "./TemplateEmailList";
import { TemplateSmsList } from "./TemplateSmsList";

export default function TemplateList() {
  const templateService = new TemplateService();

  const { data: emailTemplatesResp } = useQuery(["getAllEmailTemplates"], () =>
    templateService.getAllEmailTemplates()
  );

  const { data: smsTemplatesResp } = useQuery(["getAllSmsTemplates"], () =>
    templateService.getAllEmailTemplates()
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
