import { Metadata } from "next";

import { siteConfig } from "@/config/sites";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "../theme-provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {" "}
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <Header />
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
              </main>
              <Toaster />
            </div>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </div>
    </>
  );
}
