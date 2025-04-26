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
import { User } from "@/lib/db";
import { RoleViewer } from "@/components/role-viewer";

type UserWithRoles = Omit<User, "passwordHash"> & {
  roles: {
    role: {
      name: string;
    };
  }[];
  password: string | null;
};

interface UserTableProps {
  data: {
    users: UserWithRoles[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
  onEdit: (user: UserWithRoles) => void;
  onDelete: (user: UserWithRoles) => void;
}

export function UserTable({ data, onEdit, onDelete }: UserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [nameFilter, setNameFilter] = React.useState(
    searchParams.get("name") || ""
  );
  const [emailFilter, setEmailFilter] = React.useState(
    searchParams.get("email") || ""
  );
  const debouncedName = useDebounce(nameFilter, 500);
  const debouncedEmail = useDebounce(emailFilter, 500);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedName) {
      params.set("name", debouncedName);
    } else {
      params.delete("name");
    }
    if (debouncedEmail) {
      params.set("email", debouncedEmail);
    } else {
      params.delete("email");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [debouncedName, debouncedEmail, router, searchParams]);

  const columns: ColumnDef<UserWithRoles>[] = [
    {
      accessorKey: "name",
      header: "姓名",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "邮箱",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "roles",
      header: "角色",
      cell: ({ row }) => {
        const roles = row.getValue("roles") as UserWithRoles["roles"];
        const roleNames = roles.map((role) => role.role.name);
        return <RoleViewer value={roleNames} readOnly />;
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
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
              编辑
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(user)}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data.users,
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
          placeholder="按姓名筛选..."
          value={nameFilter}
          onChange={(event) => setNameFilter(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="按邮箱筛选..."
          value={emailFilter}
          onChange={(event) => setEmailFilter(event.target.value)}
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
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
