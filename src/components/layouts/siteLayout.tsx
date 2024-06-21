import { PropsWithChildren } from "react";
import { Toaster } from "../ui/toaster";
import { Header } from "./Header";
import { ThemeProvider } from "../theme-provider";
import { TailwindIndicator } from "../tailwind-indicator";
import { Metadata } from "next";
import { siteConfig } from "@/config/sites";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

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

const SiteLayout = ({ children }: PropsWithChildren<{}>) => {
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
          <div className="grid min-h-screen w-full">
            <div className="flex flex-col">
              <Header />
              <main className="flex min-h-screen w-full flex-1 flex-col gap-4 bg-muted/40 p-4 lg:gap-6 lg:p-6">
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
};

export default SiteLayout;
