import React, { ReactNode, useEffect } from "react";
import RootLayout from "@/components/layouts/Layout";
import ProviderList from "@/components/provider/ProviderList";
import ProviderCreate from "@/components/provider/ProviderCreate";
import { getSession, GetSessionParams } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { USER_ROLE } from "@/utils/Constants";

const Provider = ({}) => {
  const router = useRouter();
  const appId = router.query?.["app-id"];
  useEffect(() => {
    // window is accessible here.
    // console.log("window.innerHeight", window.innerHeight);
  }, []);
  return (
    <>
      <div className="flex h-14 items-center">
        <div className="w-full flex-1">
          <h1 className="text-lg font-semibold md:text-2xl">Providers</h1>
        </div>
        <ProviderCreate />
      </div>
      <div
        className="flex flex-col rounded-lg border border-dashed shadow-sm p-4"
        x-chunk="dashboard-02-chunk-1"
      >
        <ProviderList appId={String(appId)} />
      </div>
    </>
  );
};

Provider.pageOptions = {
  requiresAuth: true,
  getLayout: (children: ReactNode) => <RootLayout>{children}</RootLayout>,
};

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getSession(context);

//   if (
//     session?.user.role === USER_ROLE.ADMIN ||
//     session?.user.client_app_id === String(context.params?.["app-id"])
//   ) {
//     return {
//       props: {},
//     };
//   } else {
//     return {
//       redirect: {
//         destination: "/dashboard/" + session?.user.client_app_id,
//         permanent: true,
//       },
//     };
//   }
// }

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Provider;
