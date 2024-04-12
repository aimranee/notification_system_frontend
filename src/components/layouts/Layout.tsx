import React from "react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

function Layout({ children }: any) {
  return (
    <>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <div className="flex flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </>
  );
}

export default Layout;
