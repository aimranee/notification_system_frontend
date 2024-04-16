import React, { ReactElement } from "react";
import Layout from "@/components/layouts/Layout";
import EventCreate from "@/components/event/EventCreate";
import EventList from "@/components/event/EventList";

const Event = ({}) => {
  return (
    <>
      <div className="flex h-14 items-center">
        <div className="w-full flex-1">
          <h1 className="text-lg font-semibold md:text-2xl">Events</h1>
        </div>
        <EventCreate />
      </div>
      <div
        className="flex flex-col rounded-lg border border-dashed shadow-sm p-4"
        x-chunk="dashboard-02-chunk-1"
      >
        <EventList />
      </div>
    </>
  );
};

Event.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Event;
