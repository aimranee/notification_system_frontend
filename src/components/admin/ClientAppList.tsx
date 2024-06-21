import { useState, useEffect } from "react";
import * as React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Tabs, TabsContent } from "@/components/ui/tabs";

import { getSession, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { GetServerSidePropsContext } from "next";
import SiteLayout from "@/components/layouts/siteLayout";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ListFilter,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClientAppService from "@/services/clientAppService";
import { useQuery, useQueryClient } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientAppCreate from "@/components/admin/ClientAppCreate";
import { useToast } from "@/components/ui/use-toast";

export function ClientAppList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const current = new Date();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [listData, setListData] = useState<ClientAppResponse[]>([]);
  const [filterOption, setFilterOption] = useState<string>("All");
  const { data: session } = useSession();
  const clientAppService = new ClientAppService(
    session?.user?.access_token || ""
  );

  const { data: clientAppsResp } = useQuery(["getAllClientsApp"], () =>
    clientAppService.getAllClientsApp()
  );

  useEffect(() => {
    if (clientAppsResp) {
      // Filter data based on the selected option
      if (filterOption === "Active") {
        setListData(clientAppsResp.filter((item) => item.enabled));
      } else if (filterOption === "Not Active") {
        setListData(clientAppsResp.filter((item) => !item.enabled));
      } else {
        setListData(clientAppsResp); // Display all data if "All" is selected
      }
    }
  }, [clientAppsResp, filterOption]);

  const handleFilterChange = (option: string) => {
    setFilterOption(option);
  };

  const handleDelete = async (clientId: string) => {
    try {
      await clientAppService?.deleteClientApp(clientId);
      await Promise.all([queryClient.invalidateQueries(["getAllClientsApp"])]);
      toast({ description: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting client app:", error);
      // Handle error, e.g., show error message
    }
  };

  const columns: ColumnDef<ClientAppResponse>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "enabled",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("enabled") ? (
            <Badge variant="outline">Active</Badge>
          ) : (
            <Badge variant="secondary">Not Active</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "clientId",
      header: "ClientID",
      cell: ({ row }) => (
        <div className="hidden md:table-cell lowercase">
          {row.getValue("clientId")}
        </div>
      ),
    },
    {
      accessorKey: "clientSecret",
      header: "Secret Key",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("clientSecret")}</div>
      ),
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formattedDate = format(
          new Date(row.getValue("createdDate")),
          "yyyy-MM-dd hh a"
        ); // Format date with hours (12-hour format), minutes, and AM/PM indicator
        return (
          <div className="hidden md:table-cell lowercase">{formattedDate}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const clientApp = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem> */}
              <ClientAppCreate IsEdit ClientAppDetails={clientApp} />
              {/* </DropdownMenuItem> */}

              <DropdownMenuItem
                onClick={() => handleDelete(clientApp?.clientId)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: listData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <Input
            placeholder="Filter clientApps..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filterOption === "All"}
                  onClick={() => handleFilterChange("All")}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOption === "Active"}
                  onClick={() => handleFilterChange("Active")}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOption === "Not Active"}
                  onClick={() => handleFilterChange("Not Active")}
                >
                  Not Active
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Columns
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: any) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <ClientAppCreate />
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                Manage your applications and view their satuts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
