import React, { ReactElement } from "react";
import Layout from "@/components/layouts/Layout";
import ProviderList from "@/components/provider/ProviderList";
import ProviderCreate from "@/components/provider/ProviderCreate";

const Provider = ({}) => {
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

Provider.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Provider;
