import * as React from "react";
import { getSession } from "next-auth/react";
import { ReactNode } from "react";
import { GetServerSidePropsContext } from "next";
import SiteLayout from "@/components/layouts/siteLayout";
import { ClientAppList } from "@/components/admin/ClientAppList";

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ClientAppList />
        </div>
      </div>
    </>
  );
};

Dashboard.pageOptions = {
  requiresAuth: true,
  getLayout: (children: ReactNode) => <SiteLayout>{children}</SiteLayout>,
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

export default Dashboard;
