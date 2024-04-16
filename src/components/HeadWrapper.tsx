import Head from "next/head";

export default function HeadWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Adria | Notification System</title>
      </Head>
      {children}
    </>
  );
}
