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

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const form = useForm();
  const { toast } = useToast();

  const onSubmit = async (values: unknown) => {
    const data = {
      redirect: false,
      username,
      password,
    };

    try {
      const response = await signIn("credentials", data);
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
    <div>
      <Form {...form}>
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  <FormItem>
                    <div className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          type="username"
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
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
          <div className="hidden bg-muted lg:block">
            {/* <Image
            src="/placeholder.svg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          /> */}
          </div>
        </div>
      </Form>
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

  if (!session) {
    return {
      props: {},
    };
  } else {
    return {
      redirect: {
        destination: `/`,
        permanent: true,
      },
    };
  }
}
