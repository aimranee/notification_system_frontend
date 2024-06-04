import React, { ReactNode, useEffect } from "react";
import { UrlshorteningList } from "@/components/urlshortening/UrlshorteningList";
import { getSession, GetSessionParams } from "next-auth/react";
import RootLayout from "@/components/layouts/Layout";

const Urlshortening = ({}) => {
  useEffect(() => {
    // window is accessible here.
    // console.log("window.innerHeight", window.innerHeight);
  }, []);
  return (
    <>
      <div className="flex h-14 items-center">
        <div className="w-full flex-1">
          <h1 className="text-lg font-semibold md:text-2xl">Url Shortening</h1>
        </div>
      </div>
      <div
        className="flex flex-col rounded-lg border border-dashed shadow-sm p-4"
        x-chunk="dashboard-02-chunk-1"
      >
        <UrlshorteningList />
      </div>
    </>
  );
};

Urlshortening.pageOptions = {
  requiresAuth: true,
  getLayout: (children: ReactNode) => <RootLayout>{children}</RootLayout>,
};

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

export default Urlshortening;
