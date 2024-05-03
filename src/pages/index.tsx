import { ReactElement } from "react";
import Layout from "@/components/layouts/Layout";
import Dashboard from "@/components/Dashboard";

const Home = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
