import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PropsWithChildren, useEffect, type ReactNode } from "react";
import HeadWrapper from "@/components/HeadWrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import SiteLayout from "@/components/layouts/siteLayout";
import Spinner from "@/components/spinner";
import RouteChangeIndicator from "@/components/RouteChangeIndicator";
import { SessionProvider, useSession } from "next-auth/react";
import { USER_ROLE } from "@/utils/Constants";

function getDefaultLayout(children: ReactNode): ReactNode {
  return <SiteLayout>{children}</SiteLayout>;
}

export default function App(props: AppProps | any) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  const queryClient = new QueryClient();

  const renderAppLayout = () => {
    const children = <Component {...pageProps} />;
    const { getLayout = getDefaultLayout } = Component.pageOptions || {};

    return getLayout(children);
  };

  if (session === "loading") return <Spinner.FullPage />;

  return (
    <QueryClientProvider client={queryClient}>
      <HeadWrapper>
        <SessionProvider session={session}>
          <AuthManager {...props}>
            {renderAppLayout()}
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthManager>
          <RouteChangeIndicator />
        </SessionProvider>
      </HeadWrapper>
    </QueryClientProvider>
  );
}

function AuthManager({ Component, children, router }: PropsWithChildren<any>) {
  const { data: session, status }: any = useSession();
  const { redirectIfAuthenticated = false, requiresAuth = false } =
    Component.pageOptions || {};

  useEffect(() => {
    if (status === "loading") return;
    if (requiresAuth && !session) {
      router.replace(
        `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`
      );
      return;
    }

    if (!!session && redirectIfAuthenticated) {
      let redirectUrl = "/dashboard/" + session?.user.client_app_id;
      if (session?.user.role === USER_ROLE.ADMIN) {
        redirectUrl = "/admin";
      }

      router.replace(redirectUrl);
    }
  }, [status, redirectIfAuthenticated, requiresAuth, router, session]);

  if (
    status === "loading" ||
    (requiresAuth && !session) ||
    (!!session && redirectIfAuthenticated)
  ) {
    return <Spinner.FullPage />;
  }
  return <>{children}</>;
}
