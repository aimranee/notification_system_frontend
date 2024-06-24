import Link from "next/link";
import { Home, LineChart, Package, Package2, Users } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ClientAppService from "@/services/clientAppService";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

export function Sidebar({
  children,
  header,
}: {
  children: ReactNode;
  header?: JSX.Element;
}) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const clientAppService = new ClientAppService("");
  const handleItemClick = (itemName: string) => {
    setSelectedItem(itemName);
  };
  const [selectedMenu, setSelectedMenu] = useState<any>();

  useEffect(() => {
    setSelectedMenu(router.pathname.split("/")[1] || "dashboard");
  }, [router.pathname]);
  const { data: session } = useSession();
  const appId = session?.user.client_app_id || router.query?.["app-id"];

  const { data: appResp } = useQuery(["getClientAppByKeycloak"], () =>
    clientAppService.getClientAppByKeycloak(String(appId))
  );

  const dashboardUrl = `/dashboard/${appId}`;

  const logoUrl = !session?.user.client_app_id
    ? "/admin"
    : `/dashboard/${appId}`;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href={logoUrl}
            className="flex items-center gap-2 font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="">
              {appResp?.name ? appResp?.name : "Notification System"}
            </span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href={dashboardUrl}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                selectedItem === "Dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              } transition-all hover:text-primary`}
              onClick={() => handleItemClick("Dashboard")}
            >
              <Home className="h-12 w-4" />
              Dashboard
            </Link>
            <Link
              href={`/event/${appId}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                selectedItem === "Template"
                  ? "text-primary"
                  : "text-muted-foreground"
              } transition-all hover:text-primary`}
              onClick={() => handleItemClick("Template")}
            >
              <Package className="h-12 w-4" />
              Events
            </Link>
            <Link
              href={`/provider/${appId}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                selectedItem === "Provider"
                  ? "text-primary"
                  : "text-muted-foreground"
              } transition-all hover:text-primary`}
              onClick={() => handleItemClick("Provider")}
            >
              <Users className="h-12 w-4" />
              Provider
            </Link>
            <Link
              href={`/urlshortening/${appId}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                selectedItem === "urlshortening"
                  ? "text-primary"
                  : "text-muted-foreground"
              } transition-all hover:text-primary`}
              onClick={() => handleItemClick("urlshortening")}
            >
              <LineChart className="h-12 w-4" />
              URL Shortening
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
