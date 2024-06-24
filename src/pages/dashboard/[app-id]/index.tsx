import RootLayout from "@/components/layouts/Layout";
import { USER_ROLE } from "@/utils/Constants";
import { GetServerSidePropsContext } from "next";
import { getSession, GetSessionParams, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const AppId = ({}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const appId = router.query?.["app-id"];

  return (
    <div>
      <div className="flex items-center">
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
      </div>
    </div>
  );
};

export default AppId;

AppId.pageOptions = {
  requiresAuth: true,
  getLayout: (children: ReactNode) => <RootLayout>{children}</RootLayout>,
};

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getSession(context);

//   if (
//     session?.user.role === USER_ROLE.ADMIN ||
//     session?.user.client_app_id === String(context.params?.["app-id"])
//   ) {
//     return {
//       props: {},
//     };
//   } else {
//     return {
//       redirect: {
//         destination: "/dashboard/" + session?.user.client_app_id,
//         permanent: false,
//       },
//     };
//   }
// }

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
