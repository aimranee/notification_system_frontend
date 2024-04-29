import { useQuery } from "react-query";
import ProviderService from "@/services/EmailproviderService";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { EmailProviderList } from "./EmailProviderList";

export default function ProviderList() {
  const providerService = new ProviderService();

  const { data: emailProvidersResp } = useQuery(["getAllEmailProviders"], () =>
    providerService.getAllEmailProviders()
  );

  // const { data: smsProvidersResp } = useQuery(["getAllSmsProviders"], () =>
  //   providerService.getProvidersByType(NotificationType.SMS)
  // );

  const tabs = [
    {
      label: "Email",
      value: "email",
      children: (
        <EmailProviderList allEmailProvidersResp={emailProvidersResp} />
      ),
    },
    {
      label: "SMS",
      value: "sms",
      // children: <ProviderListByType allProvidersResp={} />,
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
