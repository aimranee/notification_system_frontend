// import { ClientAppList } from "@/components/admin/ClientAppList";
// import RootLayout from "@/components/layouts/Layout";
// import { GetServerSidePropsContext } from "next";
// import { getSession } from "next-auth/react";
// import { ReactNode } from "react";

// const Application = () => {
//   return (
//     <>
//       <div className="text-right">
//         {/* <EventCreate /> */}
//       </div>
//       <div>
//         <div className="pt-3">
//           <h2 className="text-2xl font-semibold pb-2">Applications</h2>
//           <div
//             className="flex flex-col rounded-lg border border-dashed shadow-sm p-4"
//             x-chunk="dashboard-02-chunk-1"
//           >
//             <ClientAppList />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// Application.pageOptions = {
//   requiresAuth: true,
//   getLayout: (children: ReactNode) => <RootLayout>{children}</RootLayout>,
// };

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

// export default Application;
