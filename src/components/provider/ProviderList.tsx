import { useQuery } from "react-query";
import ProviderService from "@/services/EmailproviderService";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { EmailProviderList } from "./EmailProviderList";
import { useSession } from "next-auth/react";

export default function ProviderList() {
  const { data: session, status } = useSession();
  const providerService = new ProviderService(
    session?.user?.access_token || ""
  );

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
