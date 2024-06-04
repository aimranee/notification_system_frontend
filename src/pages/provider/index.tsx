import React, {  ReactNode, useEffect } from "react";
import RootLayout from "@/components/layouts/Layout";
import ProviderList from "@/components/provider/ProviderList";
import ProviderCreate from "@/components/provider/ProviderCreate";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

const Provider = ({}) => {
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
        <ProviderList />
      </div>
    </>
  );
};

Provider.pageOptions = {
  requiresAuth: true,
  getLayout: (children: ReactNode) => <RootLayout>{children}</RootLayout>,
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
    props: {},
  };
}

export default Provider;
