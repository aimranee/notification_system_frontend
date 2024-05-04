import React, { Fragment, ReactElement } from "react";
import Layout from "@/components/layouts/Layout";
import EventList from "@/components/event/EventList";
import EventCreate from "@/components/event/EventCreate";

const Event = () => {
  return (
    <Fragment>
      <div className="text-right">
        <EventCreate />
      </div>
      <div>
        <div className="pt-3">
          <h2 className="text-2xl font-semibold pb-2">Events</h2>
          <div
            className="flex flex-col rounded-lg border border-dashed shadow-sm p-4"
            x-chunk="dashboard-02-chunk-1"
          >
            <EventList />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Event.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Event;
