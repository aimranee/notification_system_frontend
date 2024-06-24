import React, { Fragment, ReactNode } from "react";
import RootLayout from "@/components/layouts/Layout";
import EventList from "@/components/event/EventList";
import EventCreate from "@/components/event/EventCreate";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

const Event = () => {
  const router = useRouter();
  const appId = router.query?.["app-id"];
  return (
    <>
      <div className="text-right">
        <EventCreate appId={String(appId)} />
      </div>
      <div>
        <div className="pt-3">
          <h2 className="text-2xl font-semibold pb-2">Events</h2>
          <div className="flex flex-col rounded-lg border border-dashed shadow-sm p-4">
            <EventList appId={String(appId)} />
          </div>
        </div>
      </div>
    </>
  );
};

Event.pageOptions = {
  requiresAuth: true,
  getLayout: (children: ReactNode) => <RootLayout>{children}</RootLayout>,
};

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/auth/login",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// }

export default Event;
