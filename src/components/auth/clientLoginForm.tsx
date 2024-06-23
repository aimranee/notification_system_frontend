"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import Spinner from "@/components/spinner";
import { FieldType } from "@/utils/Fields";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import Link from "next/link";

export function ClientLoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const form = useForm();

  const onSubmit = async (values: unknown) => {
    const data = {
      redirect: false,
      clientId,
      clientSecret,
    };

    try {
      const response = await signIn("client-credentials", data);
      if (response?.error) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: `Login Error: ${response.error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({ description: "Login success, redirecting..." });
        router.push("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: `An unexpected error occurred: ${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  if (status === "loading") return <Spinner.FullPage />;

  return (
    <>
      <Form {...form}>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">ClientApp Login</h1>
              <p className="text-balance text-muted-foreground">
                Please enter your information to access your clientApp account.
              </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel htmlFor="clientId">Client ID</FormLabel>
                    <FormControl>
                      <Input
                        id="clientId"
                        type="text"
                        onChange={(e) => setClientId(e.target.value)}
                        required
                      />
                    </FormControl>
                  </div>
                </FormItem>
                <FormItem>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel htmlFor="clientSecret">
                        Client Secret
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        id="clientSecret"
                        type="password"
                        onChange={(e) => setClientSecret(e.target.value)}
                        required
                      />
                    </FormControl>
                  </div>
                </FormItem>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Form>
    </>
  );
}
