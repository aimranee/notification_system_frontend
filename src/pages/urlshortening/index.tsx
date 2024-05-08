import React, { ReactElement, useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import { UrlshorteningList } from "@/components/urlshortening/UrlshorteningList";

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
        {/* <ProviderCreate /> */}
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

Urlshortening.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Urlshortening;
