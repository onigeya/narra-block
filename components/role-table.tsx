"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { PermissionViewer } from "./permission-viewer";
import { Role } from "@/lib/db";

type RoleWithPermissions = Role & {
  permissions: string[];
};

interface RoleTableProps {
  data: {
    roles: RoleWithPermissions[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
  onEdit: (role: RoleWithPermissions) => void;
  onDelete: (role: RoleWithPermissions) => void;
}

export function RoleTable({ data, onEdit, onDelete }: RoleTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [nameFilter, setNameFilter] = React.useState(searchParams.get("name") || "");
  const [descriptionFilter, setDescriptionFilter] = React.useState(searchParams.get("description") || "");
  const debouncedName = useDebounce(nameFilter, 500);
  const debouncedDescription = useDebounce(descriptionFilter, 500);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedName) {
      params.set("name", debouncedName);
    } else {
      params.delete("name");
    }
    if (debouncedDescription) {
      params.set("description", debouncedDescription);
    } else {
      params.delete("description");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [debouncedName, debouncedDescription, router, searchParams]);

  const columns: ColumnDef<RoleWithPermissions>[] = [
    {
      accessorKey: "name",
      header: "角色名称",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "描述",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      accessorKey: "permissions",
      header: "权限",
      cell: ({ row }) => {
        const permissions = row.getValue("permissions") as string[];
        return <PermissionViewer value={permissions} readOnly />;
      },
    },
    {
      accessorKey: "createdAt",
      header: "创建时间",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{format(date, "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}</div>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: "更新时间",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return <div>{format(date, "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}</div>;
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(role)}>
              编辑
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(role)}>
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data.roles,
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
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="按角色名称筛选..."
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="按描述筛选..."
          value={descriptionFilter}
          onChange={(event) => setDescriptionFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              显示列
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
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
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          共 {data.pagination.total} 条记录
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(Math.max(1, data.pagination.page - 1)));
              router.push(`?${params.toString()}`);
            }}
            disabled={data.pagination.page <= 1}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set(
                "page",
                String(
                  Math.min(data.pagination.totalPages, data.pagination.page + 1)
                )
              );
              router.push(`?${params.toString()}`);
            }}
            disabled={data.pagination.page >= data.pagination.totalPages}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
} 