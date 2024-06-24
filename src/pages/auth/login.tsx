import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientLoginForm } from "@/components/auth/clientLoginForm";
import AdminLoginForm from "@/components/auth/adminLoginForm";
import { USER_ROLE } from "@/utils/Constants";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const tabs = [
    {
      label: "Admin",
      value: "admin",
      children: <AdminLoginForm></AdminLoginForm>,
    },
    {
      label: "ClientApp",
      value: "clientApp",
      children: <ClientLoginForm></ClientLoginForm>,
    },
  ];

  return (
    <div className="w-full lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-[500px]">
      <div className="mx-auto max-w-sm">
        <Tabs defaultValue="admin">
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
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/digitrust.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPage;

LoginPage.pageOptions = {
  redirectIfAuthenticated: true,
  requiresAuth: false,
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const isAdmin = session?.user.role === USER_ROLE.ADMIN;
  const appId = session?.user.client_app_id;

  if (!session) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        destination: isAdmin ? "/admin" : `/dashboard/${appId}`,
        permanent: true,
      },
    };
  }
}
