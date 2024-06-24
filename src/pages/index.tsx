import { ReactNode } from "react";
import RootLayout from "@/components/layouts/Layout";
import { getSession, GetSessionParams } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

export default function Home() {
  return (
    <>
      {/* <Dashboard /> */}
      {/* <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no data here yet
          </h3>
        </div>
      </div> */}
    </>
  );
}

Home.pageOptions = {
  requiresAuth: true,
  getLayout: (children: ReactNode) => <RootLayout>{children}</RootLayout>,
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const session = await getSession(context);

  // if (!session) {
  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
  // }
}
