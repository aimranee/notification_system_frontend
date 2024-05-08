import Link from "next/link";
import { Home, LineChart, Package, Package2, Users } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const handleItemClick = (itemName: string) => {
    setSelectedItem(itemName);
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Notification System</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/"
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
              href="/event"
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
              href="/provider"
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
              href="/urlshortening"
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
